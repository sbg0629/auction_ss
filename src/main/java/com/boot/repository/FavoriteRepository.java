package com.boot.repository;

import com.boot.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndAuctionId(Long userId, Long auctionId);
    boolean existsByUserIdAndAuctionId(Long userId, Long auctionId);
}
