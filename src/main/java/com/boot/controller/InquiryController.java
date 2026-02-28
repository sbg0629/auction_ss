package com.boot.controller;

import com.boot.entity.Inquiry;
import com.boot.entity.User;
import com.boot.repository.InquiryRepository;
import com.boot.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    // User: Create Inquiry
    @PostMapping("/inquiries")
    public ResponseEntity<?> createInquiry(@RequestBody InquiryRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User author = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Inquiry inquiry = Inquiry.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(author)
                .build();
        
        inquiryRepository.save(inquiry);
        return ResponseEntity.ok("Inquiry created successfully");
    }

    // User: Get My Inquiries
    @GetMapping("/inquiries/my")
    public ResponseEntity<List<InquiryDto>> getMyInquiries(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User author = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Inquiry> inquiries = inquiryRepository.findByAuthorOrderByCreatedAtDesc(author);
        return ResponseEntity.ok(inquiries.stream().map(this::toDto).collect(Collectors.toList()));
    }

    // Admin: Get All Inquiries
    @GetMapping("/admin/inquiries")
    public ResponseEntity<List<InquiryDto>> getAllInquiries() {
        List<Inquiry> inquiries = inquiryRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(inquiries.stream().map(this::toDto).collect(Collectors.toList()));
    }

    // Admin: Answer Inquiry
    @PostMapping("/admin/inquiries/{id}/answer")
    public ResponseEntity<?> answerInquiry(@PathVariable Long id, @RequestBody AnswerRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inquiry not found"));

        User answerer = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        inquiry.answer(request.getAnswer(), answerer);
        inquiryRepository.save(inquiry);
        
        return ResponseEntity.ok("Inquiry answered successfully");
    }

    private InquiryDto toDto(Inquiry inquiry) {
        return InquiryDto.builder()
                .id(inquiry.getId())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .authorName(inquiry.getAuthor().getName())
                .authorEmail(inquiry.getAuthor().getEmail())
                .answer(inquiry.getAnswer())
                .answererName(inquiry.getAnswerer() != null ? inquiry.getAnswerer().getName() : null)
                .status(inquiry.getStatus().name())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }

    @Data
    public static class InquiryRequest {
        private String title;
        private String content;
    }

    @Data
    public static class AnswerRequest {
        private String answer;
    }

    @Data
    @lombok.Builder
    public static class InquiryDto {
        private Long id;
        private String title;
        private String content;
        private String authorName;
        private String authorEmail;
        private String answer;
        private String answererName;
        private String status;
        private LocalDateTime createdAt;
    }
}
