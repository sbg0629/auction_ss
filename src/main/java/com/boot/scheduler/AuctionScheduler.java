package com.boot.scheduler;

import com.boot.entity.Auction;
import com.boot.entity.Bid;
import com.boot.repository.AuctionRepository;
import com.boot.repository.BidRepository;
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

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void closeExpiredAuctions() {
        log.info("Checking for expired auctions...");
        List<Auction> expiredAuctions = auctionRepository.findAllByStatusAndEndAtBefore(
                AuctionStatus.RUNNING, LocalDateTime.now());

        for (Auction auction : expiredAuctions) {
            log.info("Closing auction ID: {}", auction.getId());
            
            // 2. Find Highest Bidder
            Optional<Bid> highestBid = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction);
            
            if (highestBid.isPresent()) {
                auction.updateStatus(AuctionStatus.ENDED);
                auction.setWinner(highestBid.get().getBidder());
                log.info("Winner found: {} for auction {}", highestBid.get().getBidder().getName(), auction.getId());
            } else {
                auction.updateStatus(AuctionStatus.NO_BIDS);
                log.info("No bids for auction {} -> NO_BIDS", auction.getId());
            }
            
            // 3. Save (Status & Winner)
            auctionRepository.save(auction);
        }
    }
}
