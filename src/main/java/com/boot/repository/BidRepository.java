package com.boot.repository;

import com.boot.entity.Auction;
import com.boot.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionIdOrderByBidAmountDesc(Long auctionId);
    List<Bid> findByBidderId(Long bidderId);
    int countByAuction(Auction auction);
    Optional<Bid> findTopByAuctionOrderByBidAmountDesc(Auction auction);
}
