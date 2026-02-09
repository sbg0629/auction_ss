package com.boot.repository;

import com.boot.entity.Auction;
import com.boot.type.AuctionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatus(AuctionStatus status);
    Page<Auction> findByStatus(AuctionStatus status, Pageable pageable);
    Page<Auction> findAll(Pageable pageable);
    List<Auction> findAllByStatusAndEndAtBefore(AuctionStatus status, LocalDateTime endAt);
    List<Auction> findByWinnerId(Long winnerId);
    Page<Auction> findByItem_TitleContaining(String title, Pageable pageable);
    Page<Auction> findByStatusAndItem_TitleContaining(AuctionStatus status, String title, Pageable pageable);
}
