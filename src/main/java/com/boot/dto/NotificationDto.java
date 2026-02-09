package com.boot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private Long relatedAuctionId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
