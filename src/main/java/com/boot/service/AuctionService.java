package com.boot.service;

import com.boot.dto.AuctionDto;
import com.boot.dto.BidDto;
import com.boot.dto.BidNotification;
import com.boot.dto.BidRequest;
import com.boot.entity.Auction;
import com.boot.entity.Bid;
import com.boot.entity.Favorite;
import com.boot.repository.AuctionRepository;
import com.boot.repository.BidRepository;
import com.boot.repository.FavoriteRepository;
import com.boot.dto.AuctionCreateRequest;
import com.boot.entity.Item;
import com.boot.entity.User;
import com.boot.repository.ItemRepository;
import com.boot.repository.UserRepository;
import com.boot.type.AuctionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
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
            return false; // Removed from favorites
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .auction(auction)
                    .build();
            favoriteRepository.save(favorite);
            return true; // Added to favorites
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

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.RUNNING) {
            throw new IllegalStateException("Auction is not running");
        }

        if (LocalDateTime.now().isAfter(auction.getEndAt())) {
            throw new IllegalStateException("Auction has ended");
        }

        // Check for previous top bidder for notification
        Optional<Bid> topBid = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction);

        // Validate bid amount
        Long minBidAmount = auction.getCurrentPrice() + auction.getMinBidUnit();
        if (request.getAmount() < minBidAmount) {
            throw new IllegalArgumentException("Bid amount must be at least " + minBidAmount);
        }

        // Create Bid
        Bid bid = Bid.builder()
                .auction(auction)
                .bidder(bidder)
                .bidAmount(request.getAmount())
                .build();
        bidRepository.save(bid);

        // Auto-Extension: Extend if bid within last 5 minutes
        if (auction.getEndAt().minusMinutes(5).isBefore(LocalDateTime.now())) {
            auction.extendTime(5); // Extend by 5 minutes
        }

        // Update Auction current price
        auction.updateCurrentPrice(request.getAmount());

        // Notify previous bidder
        if (topBid.isPresent()) {
            User previousBidder = topBid.get().getBidder();
            if (!previousBidder.getId().equals(bidder.getId())) {
                notificationService.sendNotification(previousBidder, 
                    "입찰하신 '" + auction.getItem().getTitle() + "' 경매에서 상위 입찰자가 발생했습니다.", 
                    auction.getId());
            }
        }

        // Broadcast update via WebSocket
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
    public AuctionDto createAuction(AuctionCreateRequest request, MultipartFile image, String userEmail) {
        User seller = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.store(image);
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
             imageUrl = request.getImageUrl();
        }

        // 1. Create Item
        Item item = Item.builder()
                .seller(seller)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(imageUrl)
                .category("GENERAL") // Default category
                .build();
        itemRepository.save(item);

        // 2. Create Auction
        LocalDateTime now = LocalDateTime.now();
        Auction auction = Auction.builder()
                .item(item)
                .startPrice(request.getStartPrice())
                .currentPrice(request.getStartPrice())
                .startAt(now)
                .endAt(now.plusMinutes(request.getDurationMinutes()))
                .status(AuctionStatus.RUNNING)
                .minBidUnit(request.getMinBidUnit() != null ? request.getMinBidUnit() : 1000L)
                .build();
        auctionRepository.save(auction);

        return convertToDto(auction);
    }

    public Page<AuctionDto> getAllAuctions(AuctionStatus status, String keyword, Pageable pageable) {
        Page<Auction> auctions;
        if (keyword != null && !keyword.isEmpty()) {
            if (status != null) {
                auctions = auctionRepository.findByStatusAndItem_TitleContaining(status, keyword, pageable);
            } else {
                auctions = auctionRepository.findByItem_TitleContaining(keyword, pageable);
            }
        } else {
            if (status != null) {
                auctions = auctionRepository.findByStatus(status, pageable);
            } else {
                auctions = auctionRepository.findAll(pageable);
            }
        }
        
        return auctions.map(this::convertToDto);
    }

    public List<AuctionDto> getAllAuctions(AuctionStatus status) {
        List<Auction> auctions;
        if (status != null) {
            auctions = auctionRepository.findByStatus(status);
        } else {
            auctions = auctionRepository.findAll();
        }
        
        return auctions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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
        if (name == null || name.isEmpty()) {
            return "***";
        }
        if (name.length() == 1) {
            return "*";
        }
        StringBuilder masked = new StringBuilder(name.substring(0, 1));
        for (int i = 1; i < name.length(); i++) {
            masked.append("*");
        }
        return masked.toString();
    }

    private AuctionDto convertToDto(Auction auction) {
        int bidCount = bidRepository.countByAuction(auction);
        return AuctionDto.builder()
                .id(auction.getId())
                .itemId(auction.getItem().getId())
                .itemTitle(auction.getItem().getTitle())
                .description(auction.getItem().getDescription())
                .imageUrl(auction.getItem().getImageUrl())
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
                .build();
    }
}
