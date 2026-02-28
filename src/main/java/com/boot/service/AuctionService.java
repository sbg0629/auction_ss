package com.boot.service;

import com.boot.dto.AuctionDto;
import com.boot.dto.BidDto;
import com.boot.dto.BidNotification;
import com.boot.dto.BidRequest;
import com.boot.entity.*;
import com.boot.repository.*;
import com.boot.dto.AuctionCreateRequest;
import com.boot.type.AuctionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final BidRepository bidRepository;
    private final FavoriteRepository favoriteRepository;
    private final ItemImageRepository itemImageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Transactional
    public boolean toggleFavorite(Long auctionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserIdAndAuctionId(user.getId(), auctionId);
        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return false;
        } else {
            favoriteRepository.save(Favorite.builder().user(user).auction(auction).build());
            return true;
        }
    }

    public List<AuctionDto> getFavoriteAuctions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(favorite -> convertToDto(favorite.getAuction()))
                .collect(Collectors.toList());
    }

    public List<AuctionDto> getWonAuctions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return auctionRepository.findByWinnerId(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean isFavorite(Long auctionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return favoriteRepository.existsByUserIdAndAuctionId(user.getId(), auctionId);
    }

    @Transactional
    public void placeBid(Long auctionId, BidRequest request, String userEmail) {
        User bidder = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 비관적 락으로 동시 입찰 충돌 방지
        Auction auction = auctionRepository.findByIdWithLock(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.RUNNING) {
            throw new IllegalStateException("Auction is not running");
        }
        if (LocalDateTime.now().isAfter(auction.getEndAt())) {
            throw new IllegalStateException("Auction has ended");
        }

        Optional<Bid> topBid = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction);

        Long minBidAmount = auction.getCurrentPrice() + auction.getMinBidUnit();
        if (request.getAmount() < minBidAmount) {
            throw new IllegalArgumentException("Bid amount must be at least " + minBidAmount);
        }

        Bid bid = Bid.builder()
                .auction(auction)
                .bidder(bidder)
                .bidAmount(request.getAmount())
                .build();
        bidRepository.save(bid);

        // 마지막 5분 내 입찰 시 5분 자동 연장
        if (auction.getEndAt().minusMinutes(5).isBefore(LocalDateTime.now())) {
            auction.extendTime(5);
        }

        auction.updateCurrentPrice(request.getAmount());

        // 이전 최고 입찰자에게 알림
        if (topBid.isPresent()) {
            User previousBidder = topBid.get().getBidder();
            if (!previousBidder.getId().equals(bidder.getId())) {
                notificationService.sendNotification(previousBidder,
                        "입찰하신 '" + auction.getItem().getTitle() + "' 경매에서 상위 입찰자가 발생했습니다.",
                        auction.getId());
            }
        }

        int bidCount = bidRepository.countByAuction(auction);
        BidDto bidDto = BidDto.builder()
                .id(bid.getId())
                .bidderName(maskName(bidder.getName()))
                .bidAmount(bid.getBidAmount())
                .bidTime(bid.getCreatedAt())
                .build();

        BidNotification notification = BidNotification.builder()
                .auctionId(auction.getId())
                .currentPrice(auction.getCurrentPrice())
                .bidCount(bidCount)
                .newBid(bidDto)
                .build();

        messagingTemplate.convertAndSend("/topic/auctions/" + auctionId, notification);
    }

    @Transactional
    public AuctionDto createAuction(AuctionCreateRequest request, List<MultipartFile> images, String userEmail) {
        User seller = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 첫 번째 이미지를 대표 이미지로
        String firstImageUrl = null;
        if (images != null && !images.isEmpty()) {
            firstImageUrl = fileStorageService.store(images.get(0));
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            firstImageUrl = request.getImageUrl();
        }

        Item item = Item.builder()
                .seller(seller)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(firstImageUrl)
                .category(request.getCategory() != null ? request.getCategory() : "도자기")
                .build();
        itemRepository.save(item);

        // 모든 이미지를 ItemImage에 저장
        if (images != null) {
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                if (file != null && !file.isEmpty()) {
                    String imageUrl = (i == 0) ? firstImageUrl : fileStorageService.store(file);
                    itemImageRepository.save(ItemImage.builder()
                            .item(item)
                            .imageUrl(imageUrl)
                            .sortOrder(i)
                            .build());
                }
            }
        }

        LocalDateTime now = LocalDateTime.now();
        Auction auction = Auction.builder()
                .item(item)
                .startPrice(request.getStartPrice())
                .currentPrice(request.getStartPrice())
                .startAt(now)
                .endAt(now.plusMinutes(request.getDurationMinutes()))
                // 기본값 READY: 관리자 승인 후 RUNNING 으로 변경
                .status(AuctionStatus.READY)
                .minBidUnit(request.getMinBidUnit() != null ? request.getMinBidUnit() : 1000L)
                .build();
        auctionRepository.save(auction);

        return convertToDto(auction);
    }

    public Page<AuctionDto> getAllAuctions(AuctionStatus status, String keyword, String category, Pageable pageable) {
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        boolean hasCategory = category != null && !category.isEmpty();

        Page<Auction> auctions;
        if (status != null && hasKeyword && hasCategory) {
            auctions = auctionRepository.findByStatusAndItem_TitleContainingAndItem_Category(status, keyword, category, pageable);
        } else if (status != null && hasKeyword) {
            auctions = auctionRepository.findByStatusAndItem_TitleContaining(status, keyword, pageable);
        } else if (status != null && hasCategory) {
            auctions = auctionRepository.findByStatusAndItem_Category(status, category, pageable);
        } else if (hasKeyword && hasCategory) {
            auctions = auctionRepository.findByItem_TitleContainingAndItem_Category(keyword, category, pageable);
        } else if (status != null) {
            auctions = auctionRepository.findByStatus(status, pageable);
        } else if (hasKeyword) {
            auctions = auctionRepository.findByItem_TitleContaining(keyword, pageable);
        } else if (hasCategory) {
            auctions = auctionRepository.findByItem_Category(category, pageable);
        } else {
            auctions = auctionRepository.findAll(pageable);
        }

        return auctions.map(this::convertToDto);
    }

    public List<AuctionDto> getAllAuctions(AuctionStatus status) {
        List<Auction> auctions = status != null
                ? auctionRepository.findByStatus(status)
                : auctionRepository.findAll();
        return auctions.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public AuctionDto getAuction(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));
        return convertToDto(auction);
    }

    public List<BidDto> getBids(Long auctionId) {
        return bidRepository.findByAuctionIdOrderByBidAmountDesc(auctionId).stream()
                .map(bid -> BidDto.builder()
                        .id(bid.getId())
                        .bidderName(maskName(bid.getBidder().getName()))
                        .bidAmount(bid.getBidAmount())
                        .bidTime(bid.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private String maskName(String name) {
        if (name == null || name.isEmpty()) return "***";
        if (name.length() == 1) return "*";
        StringBuilder masked = new StringBuilder(name.substring(0, 1));
        for (int i = 1; i < name.length(); i++) masked.append("*");
        return masked.toString();
    }

    private AuctionDto convertToDto(Auction auction) {
        int bidCount = bidRepository.countByAuction(auction);
        List<String> imageUrls = itemImageRepository
                .findByItemIdOrderBySortOrderAsc(auction.getItem().getId())
                .stream()
                .map(ItemImage::getImageUrl)
                .collect(Collectors.toList());

        return AuctionDto.builder()
                .id(auction.getId())
                .itemId(auction.getItem().getId())
                .itemTitle(auction.getItem().getTitle())
                .description(auction.getItem().getDescription())
                .imageUrl(auction.getItem().getImageUrl())
                .imageUrls(imageUrls)
                .category(auction.getItem().getCategory())
                .startPrice(auction.getStartPrice())
                .currentPrice(auction.getCurrentPrice())
                .minBidUnit(auction.getMinBidUnit())
                .startAt(auction.getStartAt())
                .endAt(auction.getEndAt())
                .status(auction.getStatus())
                .sellerName(auction.getItem().getSeller().getName())
                .bidCount(bidCount)
                .winnerName(auction.getWinner() != null ? auction.getWinner().getName() : null)
                .paid(auction.isPaid())
                .tradeCompleted(auction.isTradeCompleted())
                .build();
    }
}
