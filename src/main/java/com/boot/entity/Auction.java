package com.boot.entity;

import com.boot.type.AuctionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "auctions")
public class Auction extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    private Long startPrice;

    @Column(nullable = false)
    private Long currentPrice;

    public void updateCurrentPrice(Long newPrice) {
        if (newPrice > this.currentPrice) {
            this.currentPrice = newPrice;
        }
    }

    @Builder.Default
    private Long minBidUnit = 1000L;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    public void extendTime(int minutes) {
        this.endAt = this.endAt.plusMinutes(minutes);
    }

    @Column(nullable = false)
    @Builder.Default
    private Double commissionRate = 10.0; // 10% fee by default

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuctionStatus status = AuctionStatus.READY;

    public void updateStatus(AuctionStatus status) {
        this.status = status;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner;

    public void setWinner(User winner) {
        this.winner = winner;
    }

    @Column(nullable = false)
    private boolean paid;

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    @Column(nullable = false)
    @Builder.Default
    private boolean tradeCompleted = false;

    public void setTradeCompleted(boolean tradeCompleted) {
        this.tradeCompleted = tradeCompleted;
    }
}
