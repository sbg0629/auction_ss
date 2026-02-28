package com.boot.repository;

import com.boot.entity.Auction;
import com.boot.type.AuctionStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatus(AuctionStatus status);
    Page<Auction> findByStatus(AuctionStatus status, Pageable pageable);
    Page<Auction> findAll(Pageable pageable);
    List<Auction> findAllByStatusAndEndAtBefore(AuctionStatus status, LocalDateTime endAt);
    List<Auction> findByWinnerId(Long winnerId);
    Page<Auction> findByItem_TitleContaining(String title, Pageable pageable);
    Page<Auction> findByStatusAndItem_TitleContaining(AuctionStatus status, String title, Pageable pageable);
    Page<Auction> findByItem_Category(String category, Pageable pageable);
    Page<Auction> findByStatusAndItem_Category(AuctionStatus status, String category, Pageable pageable);
    Page<Auction> findByStatusAndItem_TitleContainingAndItem_Category(AuctionStatus status, String title, String category, Pageable pageable);
    Page<Auction> findByItem_TitleContainingAndItem_Category(String title, String category, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Auction a WHERE a.id = :id")
    Optional<Auction> findByIdWithLock(@Param("id") Long id);
}
