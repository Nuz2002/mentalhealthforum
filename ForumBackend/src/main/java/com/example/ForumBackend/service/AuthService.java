package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.*;
import com.example.ForumBackend.model.*;
import com.example.ForumBackend.repository.*;
import com.example.ForumBackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.ForumBackend.model.ExpertVerification;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private ExpertVerificationService expertVerificationService;

    /**
     * Registers a new user. Email is unique and not enabled until verified.
     */
    public RegisterResponse register(RegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {

            System.out.println("Username already taken");
            return new RegisterResponse("Имя пользователя уже занято");

        }
        if (userRepository.existsByEmail(request.getEmail())) {

            System.out.println("Email already in use");
            return new RegisterResponse("Электронная почта уже используется");

        }

        User newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.REGULAR)
                .enabled(false) // not enabled until email verification
                .build();

        userRepository.save(newUser);

        // Generate verification token
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(newUser)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();

        emailVerificationTokenRepository.save(verificationToken);

        // Send verification email
        String verificationLink = "https://mentalhealthforum.onrender.com/api/auth/verify-email?token=" + token;
        emailService.sendVerificationEmail(newUser.getEmail(), verificationLink);

        return new RegisterResponse("Регистрация прошла успешно! Пожалуйста, подтвердите свою почту для активации аккаунта.");

    }

    /**
     * Logs in using username & password, but generates a JWT using the user's email as subject.
     */
    public LoginResponse login(LoginRequest request) {
        try {
            // 1. Attempt auth using email + password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // 2. Find user by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found by email"));

            if (!user.isEnabled()) {
                // Return response with null tokens and role if account is not enabled
                return new LoginResponse("Аккаунт не подтверждён. Пожалуйста, проверьте свою электронную почту.", null, null, null, null);

            }

            // 3. Generate short-lived Access Token
            String accessToken = jwtUtil.generateAccessToken(user.getEmail());

            // 4. Generate a DB-stored Refresh Token
            RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user);
            String refreshToken = refreshTokenEntity.getToken();

            // 5. Include the user's role in the LoginResponse
            return new LoginResponse("Вход выполнен успешно!", accessToken, refreshToken, user.getRole().name(), expertVerificationService.getLatestApplicationStatusByEmail(request.getEmail()));

        } catch (DisabledException e) {
            return new LoginResponse("Account is not verified. Please check your email.", null, null, null, null);
        } catch (BadCredentialsException e) {
            return new LoginResponse("Неверное имя пользователя или пароль", null, null, null, null);
        }
    }


    public RefreshTokenResponse refreshToken(String refreshTokenStr) {
        // 1) Find the refresh token in DB
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Refresh token not found in DB"));

        // 2) Validate (not expired, not revoked, JWT signature is correct)
        refreshTokenService.verifyRefreshToken(refreshToken);

        // 3) Generate a new access token
        String email = jwtUtil.getEmailFromRefreshToken(refreshTokenStr);
        String newAccessToken = jwtUtil.generateAccessToken(email);

        // (Optional) rotate the refresh token here (invalidate old, issue new)
        // For brevity, we'll keep the same refresh token if it's still valid.

        return new RefreshTokenResponse(newAccessToken);
    }



    /**
     * Verifies the user email by checking the token in the DB.
     */
    public String verifyEmail(String token) {
        try {
            var tokenOpt = emailVerificationTokenRepository.findByToken(token);
            if (tokenOpt.isEmpty()) {
                return "Invalid verification token";
            }
            EmailVerificationToken verificationToken = tokenOpt.get();
            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return "Verification token has expired";
            }
            User user = verificationToken.getUser();
            if (user == null) {
                return "Error: No user associated with this token";
            }
            user.setEnabled(true);
            userRepository.save(user);
            emailVerificationTokenRepository.delete(verificationToken);
            return "Электронная почта успешно подтверждена. Теперь вы можете войти.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Ошибка при подтверждении электронной почты: " + e.getMessage();
        }
    }

    /**
     * Sends a password reset email if the user is found by email.
     */
    public String forgotPassword(ForgotPasswordRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return "Пользователь с таким адресом электронной почты не найден";

        }
        User user = userOpt.get();
        // Generate reset token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = passwordResetTokenRepository.findByUser(user)
                .orElse(PasswordResetToken.builder().user(user).build());
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(2)); // token valid for 2 hours
        passwordResetTokenRepository.save(resetToken);

        emailService.sendResetPasswordEmail(user.getEmail(), token);
        return "Письмо для сброса пароля отправлено";

    }

    /**
     * Resets the user's password if the token is valid (and not expired).
     */
    public String resetPassword(ResetPasswordRequest request) {
        var tokenOpt = passwordResetTokenRepository.findByToken(request.getToken());
        if (tokenOpt.isEmpty()) {
            return "Неверный токен сброса пароля";

        }
        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return "Срок действия токена сброса пароля истёк";

        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
        return "Пароль успешно сброшен";

    }
}
