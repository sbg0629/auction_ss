package com.boot.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long auctionId;
    private String method; // CARD, BANK_TRANSFER
}
