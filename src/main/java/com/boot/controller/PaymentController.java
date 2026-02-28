package com.boot.controller;

import com.boot.dto.PaymentRequest;
import com.boot.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Void> processPayment(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        paymentService.processPayment(request, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirm/{auctionId}")
    public ResponseEntity<?> confirmTrade(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        paymentService.confirmTrade(auctionId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
