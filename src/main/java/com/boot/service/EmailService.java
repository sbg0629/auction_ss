package com.boot.service;

import com.boot.entity.EmailVerification;
import com.boot.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailVerificationRepository emailVerificationRepository;

    @Transactional
    public void sendVerificationCode(String email) {
        // 기존 인증 코드 삭제
        emailVerificationRepository.deleteAllByEmail(email);

        // 6자리 랜덤 코드 생성
        String code = String.format("%06d", new Random().nextInt(1000000));

        // DB 저장 (5분 유효)
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();
        emailVerificationRepository.save(verification);

        // 이메일 발송
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("[경매마당] 이메일 인증 코드");
            helper.setText(buildEmailContent(code), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 발송에 실패했습니다.", e);
        }
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        EmailVerification verification = emailVerificationRepository
                .findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new IllegalArgumentException("인증 요청 내역이 없습니다. 인증코드를 먼저 발송해주세요."));

        if (verification.isExpired()) {
            throw new IllegalArgumentException("인증 코드가 만료되었습니다. 다시 발송해주세요.");
        }

        if (!verification.getCode().equals(code)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        verification.markVerified();
        return true;
    }

    public boolean isEmailVerified(String email) {
        return emailVerificationRepository
                .findTopByEmailOrderByCreatedAtDesc(email)
                .map(v -> v.isVerified() && !v.isExpired())
                .orElse(false);
    }

    private String buildEmailContent(String code) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #8b4513; text-align: center;">경매마당 이메일 인증</h2>
                    <p style="color: #555; text-align: center;">아래 인증 코드를 입력해주세요.</p>
                    <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 2.5rem; font-weight: bold; letter-spacing: 8px; color: #333;">%s</span>
                    </div>
                    <p style="color: #999; font-size: 0.85rem; text-align: center;">이 코드는 <strong>5분간</strong> 유효합니다.</p>
                    <p style="color: #999; font-size: 0.8rem; text-align: center;">본인이 요청하지 않은 경우 이 이메일을 무시해주세요.</p>
                </div>
                """.formatted(code);
    }
}
