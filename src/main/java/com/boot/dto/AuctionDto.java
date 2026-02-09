package com.boot.dto;

import com.boot.type.AuctionStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuctionDto {
    private Long id;
    private Long itemId;
    private String itemTitle;
    private String description;
    private String imageUrl;
    private Long startPrice;
    private Long currentPrice;
    private Long minBidUnit;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private AuctionStatus status;
    private String sellerName;
    private int bidCount;
    private String winnerName;
    private boolean paid;
}
