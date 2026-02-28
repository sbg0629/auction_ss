package com.boot.dto;

import com.boot.type.ReportStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportDto {
    private Long id;
    private Long auctionId;
    private String auctionTitle;
    private String reporterEmail;
    private String reason;
    private ReportStatus status;
    private LocalDateTime createdAt;
}

