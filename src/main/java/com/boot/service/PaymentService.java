package com.boot.service;

import com.boot.dto.PaymentRequest;
import com.boot.entity.Auction;
import com.boot.entity.Payment;
import com.boot.entity.User;
import com.boot.repository.AuctionRepository;
import com.boot.repository.PaymentRepository;
import com.boot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @Transactional
    public void processPayment(PaymentRequest request, String userEmail) {
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Auction auction = auctionRepository.findById(request.getAuctionId())
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        if (auction.getWinner() == null || !auction.getWinner().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("Only the winner can pay for this auction");
        }

        if (auction.isPaid()) {
            throw new IllegalStateException("Auction is already paid");
        }

        Payment payment = Payment.builder()
                .auction(auction)
                .buyer(buyer)
                .amount(auction.getCurrentPrice())
                .paymentMethod(request.getMethod())
                .status("PAID")
                .transactionId(UUID.randomUUID().toString())
                .build();
        paymentRepository.save(payment);

        auction.setPaid(true);
    }

    @Transactional
    public void confirmTrade(Long auctionId, String userEmail) {
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        if (auction.getWinner() == null || !auction.getWinner().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("Only the winner can confirm this auction");
        }

        if (!auction.isPaid()) {
            throw new IllegalStateException("Payment is not completed yet");
        }

        auction.setTradeCompleted(true);
    }
}
