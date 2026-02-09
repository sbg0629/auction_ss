package com.boot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BidDto {
    private Long id;
    private String bidderName; // Masked name
    private Long bidAmount;
    private LocalDateTime bidTime;
}
