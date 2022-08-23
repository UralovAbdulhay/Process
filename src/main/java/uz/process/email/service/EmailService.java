package uz.process.email.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import uz.process.email.payload.MailPayload;

@Service
public class EmailService {

    @Value("${app.email.admin.to}")
    String to;

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public String sendSimpleMessage(MailPayload payload) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(payload.getSubject());
        message.setText(String.format("From: %s \nEmail: %s \nMessage: %s", payload.getName(), payload.getGmail(), payload.getText()));
        emailSender.send(message);
        return "<h1>Success</h1>";
    }
}