package com.boot.scheduler;

import com.boot.entity.Auction;
import com.boot.entity.Bid;
import com.boot.repository.AuctionRepository;
import com.boot.repository.BidRepository;
import com.boot.service.NotificationService;
import com.boot.type.AuctionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 10000) // 10초마다 체크
    @Transactional
    public void closeExpiredAuctions() {
        List<Auction> expiredAuctions = auctionRepository.findAllByStatusAndEndAtBefore(
                AuctionStatus.RUNNING, LocalDateTime.now());

        for (Auction auction : expiredAuctions) {
            log.info("Closing auction ID: {}", auction.getId());

            Optional<Bid> highestBid = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction);

            if (highestBid.isPresent()) {
                auction.updateStatus(AuctionStatus.ENDED);
                auction.setWinner(highestBid.get().getBidder());
                log.info("Winner: {} for auction {}", highestBid.get().getBidder().getName(), auction.getId());

                // 낙찰자에게 알림 전송
                notificationService.sendNotification(
                        highestBid.get().getBidder(),
                        "'" + auction.getItem().getTitle() + "' 경매에 낙찰되셨습니다! 7일 이내 결제를 완료해주세요.",
                        auction.getId()
                );
            } else {
                auction.updateStatus(AuctionStatus.NO_BIDS);
                log.info("No bids for auction {} -> NO_BIDS", auction.getId());
            }

            auctionRepository.save(auction);
        }
    }
}
