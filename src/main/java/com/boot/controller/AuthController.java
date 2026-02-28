package com.boot.controller;

import com.boot.dto.*;
import com.boot.entity.User;
import com.boot.repository.UserRepository;
import com.boot.security.JwtUtil;
import com.boot.security.LoginRateLimiter;
import com.boot.service.EmailService;
import com.boot.service.UserService;
import com.boot.type.Provider;
import com.boot.type.UserRole;
import com.boot.type.UserStatus;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final EmailService emailService;
    private final LoginRateLimiter loginRateLimiter;

    // 이메일 인증 코드 발송
    @PostMapping("/email/send")
    public ResponseEntity<?> sendEmailVerification(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("이메일을 입력해주세요.");
        }
        try {
            emailService.sendVerificationCode(email);
            return ResponseEntity.ok("인증 코드가 발송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("이메일 발송에 실패했습니다: " + e.getMessage());
        }
    }

    // 이메일 인증 코드 확인
    @PostMapping("/email/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        if (email == null || code == null) {
            return ResponseEntity.badRequest().body("이메일과 인증 코드를 입력해주세요.");
        }
        try {
            emailService.verifyCode(email, code);
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody FindIdRequest request) {
        try {
            String email = userService.findEmail(request.getName(), request.getPhoneNumber());
            return ResponseEntity.ok(Map.of("email", email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            validatePassword(request.getNewPassword());
            userService.resetPassword(request.getEmail(), request.getName(), request.getPhoneNumber(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }

        if (!emailService.isEmailVerified(request.getEmail())) {
            return ResponseEntity.badRequest().body("이메일 인증을 완료해주세요.");
        }

        if (!request.isPrivacyAgreed()) {
            return ResponseEntity.badRequest().body("개인정보 수집 및 이용에 동의해야 합니다.");
        }

        try {
            validatePassword(request.getPassword());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .detailAddress(request.getDetailAddress())
                .privacyAgreed(request.isPrivacyAgreed())
                .provider(Provider.LOCAL)
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String key = buildLoginKey(request.getEmail(), httpRequest);

        if (loginRateLimiter.isBlocked(key)) {
            return ResponseEntity.status(429).body("로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            loginRateLimiter.onFailure(key);
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        loginRateLimiter.onSuccess(key);

        // Find user to get the name
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Check if user is banned
        if (user.getStatus() == UserStatus.BANNED) {
            if (user.getBannedUntil() != null && user.getBannedUntil().isBefore(LocalDateTime.now())) {
                // Ban expired
                user.unban();
                userRepository.save(user);
            } else {
                return ResponseEntity.status(403).body("Account suspended.");
            }
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(request.getEmail(), user.getRole().name());
        
        return ResponseEntity.ok(new TokenResponse(token, "Bearer", user.getName(), user.getRole().name(), user.getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), userDto));
    }

    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이어야 합니다.");
        }
        if (!password.matches(".*[A-Z].*") ||
                !password.matches(".*[a-z].*") ||
                !password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("비밀번호에는 대문자, 소문자, 숫자가 각각 최소 1자 이상 포함되어야 합니다.");
        }
    }

    private String buildLoginKey(String email, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        return (email != null ? email : "unknown") + ":" + ip;
    }
}
