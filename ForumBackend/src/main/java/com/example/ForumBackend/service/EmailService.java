package com.example.ForumBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // This folders needs some change after front-end deployment

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String to, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("mailforum368@gmail.com");
        message.setTo(to);
        message.setSubject("Запрос на сброс пароля");
        message.setText("Чтобы сбросить пароль, перейдите по следующей ссылке:\n" + resetLink);
        mailSender.send(message);
    }

    public void sendVerificationEmail(String to, String verificationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("mailforum368@gmail.com"); // Проверенный отправитель
        message.setTo(to);
        message.setSubject("Подтверждение электронной почты");
        message.setText("Спасибо за регистрацию. Пожалуйста, подтвердите свою электронную почту, перейдя по ссылке ниже:\n" + verificationLink);
        mailSender.send(message);
    }
}
