package com.example.ForumBackend.security;

import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Loads a user for authentication.
     *
     * If the input contains an '@', it's treated as an email; otherwise, as a username.
     * The returned UserDetails uses the user's email as the principal so that JWT token
     * generation and subsequent lookups (by email) are consistent.
     */
    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        User user;
        if (input.contains("@")) {
            user = userRepository.findByEmail(input)
                    .orElseThrow(() -> new UsernameNotFoundException("Пользователь с электронной почтой " + input + " не найден"));

        } else {
            user = userRepository.findByUsername(input)
                    .orElseThrow(() -> new UsernameNotFoundException("Пользователь с именем пользователя " + input + " не найден"));

        }

        // Return a UserDetails object that uses the user's email as the principal.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),     // principal (used as the subject in the JWT)
                user.getPassword(),
                user.isEnabled(),    // enabled flag
                true,                // accountNonExpired
                true,                // credentialsNonExpired
                true,                // accountNonLocked
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
