package com.boot.controller;

import com.boot.dto.AdminDashboardDto;
import com.boot.dto.AdminRevenueDto;
import com.boot.dto.UserDto;
import com.boot.entity.Auction;
import com.boot.entity.Faq;
import com.boot.entity.Notice;
import com.boot.entity.Payment;
import com.boot.entity.User;
import com.boot.repository.*;
import com.boot.type.AuctionStatus;
import com.boot.type.UserStatus;
import com.boot.service.DeliveryService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;
    private final FaqRepository faqRepository;
    private final AuctionRepository auctionRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryService deliveryService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAuctions = auctionRepository.count();
        long activeAuctions = auctionRepository.findByStatus(AuctionStatus.RUNNING).size();
        long totalSales = paymentRepository.findAll().stream()
                .mapToLong(Payment::getAmount)
                .sum();

        return ResponseEntity.ok(AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .totalAuctions(totalAuctions)
                .activeAuctions(activeAuctions)
                .totalSales(totalSales)
                .build());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<AdminRevenueDto>> getRevenue() {
        List<Payment> payments = paymentRepository.findAll();
        List<AdminRevenueDto> revenueList = payments.stream()
                .map(payment -> {
                    Auction auction = payment.getAuction();
                    // Assuming payment amount is Total (Bid + Fee)
                    // and Auction Current Price is the Winning Bid (Net Amount for Seller)
                    Long netAmount = auction.getCurrentPrice();
                    Long totalAmount = payment.getAmount();
                    Long feeAmount = totalAmount - netAmount;

                    return AdminRevenueDto.builder()
                            .paymentId(payment.getId())
                            .auctionId(auction.getId())
                            .itemTitle(auction.getItem().getTitle())
                            .buyerName(payment.getBuyer().getName())
                            .sellerName(auction.getItem().getSeller().getName())
                            .totalAmount(totalAmount)
                            .netAmount(netAmount)
                            .feeAmount(feeAmount)
                            .paymentDate(payment.getCreatedAt())
                            .status(payment.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(revenueList);
    }

    @PostMapping("/payments/{id}/delivery")
    public ResponseEntity<?> registerDelivery(@PathVariable Long id, @RequestBody Map<String, String> request) {
        deliveryService.registerTracking(id, request.get("courierName"), request.get("trackingNumber"));
        return ResponseEntity.ok("Delivery registered successfully");
    }

    @PostMapping("/auctions/{id}/cancel")
    public ResponseEntity<?> cancelAuction(@PathVariable Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));
        auction.updateStatus(AuctionStatus.CANCELED);
        auctionRepository.save(auction);
        return ResponseEntity.ok("Auction canceled successfully");
    }

    @PostMapping("/auctions/{id}/delete")
    public ResponseEntity<?> deleteAuction(@PathVariable Long id) {
        auctionRepository.deleteById(id);
        return ResponseEntity.ok("Auction deleted successfully");
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(user -> UserDto.builder()
                        .email(user.getEmail())
                        .name(user.getName())
                        .address(user.getAddress())
                        .detailAddress(user.getDetailAddress())
                        .status(user.getStatus()) // Added status to DTO
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @PostMapping("/users/{email}/ban")
    public ResponseEntity<?> banUser(@PathVariable String email, @RequestBody BanRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        LocalDateTime bannedUntil = LocalDateTime.now().plusDays(request.getDays());
        user.ban(bannedUntil, request.getReason());
        
        userRepository.save(user);
        return ResponseEntity.ok("User banned successfully");
    }

    @Data
    public static class BanRequest {
        private int days;
        private String reason;
    }

    @PostMapping("/users/{email}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.unban();
        userRepository.save(user);
        return ResponseEntity.ok("User unbanned successfully");
    }

    @PostMapping("/users/{email}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PostMapping("/notices")
    public ResponseEntity<?> createNotice(@RequestBody Map<String, String> request, @AuthenticationPrincipal UserDetails userDetails) {
        User author = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        
        Notice notice = Notice.builder()
                .title(request.get("title"))
                .content(request.get("content"))
                .author(author)
                .build();
        noticeRepository.save(notice);
        return ResponseEntity.ok("Notice created successfully");
    }

    @PostMapping("/faqs")
    public ResponseEntity<?> createFaq(@RequestBody Map<String, String> request, @AuthenticationPrincipal UserDetails userDetails) {
        User author = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        Faq faq = Faq.builder()
                .question(request.get("question"))
                .answer(request.get("answer"))
                .author(author)
                .build();
        faqRepository.save(faq);
        return ResponseEntity.ok("FAQ created successfully");
    }
}
