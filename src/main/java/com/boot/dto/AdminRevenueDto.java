package com.boot.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminRevenueDto {
    private Long paymentId;
    private Long auctionId;
    private String itemTitle;
    private String buyerName;
    private String sellerName;
    private Long totalAmount; // The amount paid (e.g., 110,000)
    private Long netAmount;   // The item price (e.g., 100,000)
    private Long feeAmount;   // The commission (e.g., 10,000)
    private LocalDateTime paymentDate;
    private String status;
}
