package com.boot.controller;

import com.boot.dto.ReportDto;
import com.boot.entity.Auction;
import com.boot.entity.Report;
import com.boot.entity.User;
import com.boot.repository.AuctionRepository;
import com.boot.repository.ReportRepository;
import com.boot.repository.UserRepository;
import com.boot.type.ReportStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @PostMapping("/reports")
    public ResponseEntity<?> createReport(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        String reason = body.get("reason");
        Long auctionId;
        try {
            auctionId = Long.parseLong(body.get("auctionId"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("잘못된 경매 ID 입니다.");
        }

        if (reason == null || reason.isBlank()) {
            return ResponseEntity.badRequest().body("신고 사유를 입력해주세요.");
        }

        User reporter = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        Report report = Report.builder()
                .reporter(reporter)
                .auction(auction)
                .reason(reason)
                .status(ReportStatus.OPEN)
                .build();

        reportRepository.save(report);
        return ResponseEntity.ok("신고가 접수되었습니다.");
    }

    @GetMapping("/admin/reports")
    public ResponseEntity<List<ReportDto>> getReports() {
        List<Report> reports = reportRepository.findAll();
        List<ReportDto> dtos = reports.stream()
                .map(r -> ReportDto.builder()
                        .id(r.getId())
                        .auctionId(r.getAuction().getId())
                        .auctionTitle(r.getAuction().getItem().getTitle())
                        .reporterEmail(r.getReporter().getEmail())
                        .reason(r.getReason())
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/admin/reports/{id}/resolve")
    public ResponseEntity<?> resolveReport(@PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        report.resolve();
        reportRepository.save(report);
        return ResponseEntity.ok("Report resolved");
    }
}

