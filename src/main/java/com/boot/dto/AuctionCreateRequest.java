package com.boot.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AuctionCreateRequest {
    private String title;
    private String description;
    private String imageUrl;
    private Long startPrice;
    private Long minBidUnit;
    private Integer durationMinutes; // Duration in minutes
}
