package com.boot.dto;

import lombok.Data;

@Data
public class AuctionCreateRequest {
    private String title;
    private String description;
    private String imageUrl;
    private String category;
    private Long startPrice;
    private Long minBidUnit;
    private Integer durationMinutes;
}
