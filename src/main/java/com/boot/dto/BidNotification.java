package com.boot.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BidNotification {
    private Long auctionId;
    private Long currentPrice;
    private int bidCount;
    private BidDto newBid;
}
