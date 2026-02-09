package com.boot.controller;

import com.boot.dto.*;
import com.boot.entity.User;
import com.boot.repository.UserRepository;
import com.boot.security.JwtUtil;
import com.boot.service.UserService;
import com.boot.type.Provider;
import com.boot.type.UserRole;
import com.boot.type.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

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
            userService.resetPassword(request.getEmail(), request.getName(), request.getPhoneNumber(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        if (!request.isPrivacyAgreed()) {
            return ResponseEntity.badRequest().body("You must agree to the privacy policy");
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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // Find user to get the name
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Check if user is banned
        if (user.getStatus() == UserStatus.BANNED) {
            if (user.getBannedUntil() != null && user.getBannedUntil().isBefore(LocalDateTime.now())) {
                // Ban expired
                user.unban();
                userRepository.save(user);
            } else {
                return ResponseEntity.status(403).body("Account suspended until " + user.getBannedUntil() + ". Reason: " + user.getBanReason());
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
}
