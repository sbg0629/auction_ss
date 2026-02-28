package com.boot.controller;

import com.boot.dto.AuctionCreateRequest;
import com.boot.dto.AuctionDto;
import com.boot.dto.BidDto;
import com.boot.dto.BidRequest;
import com.boot.entity.Delivery;
import com.boot.repository.DeliveryRepository;
import com.boot.repository.AuctionRepository;
import com.boot.service.DeliveryService;
import com.boot.service.AuctionService;
import com.boot.type.AuctionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final DeliveryRepository deliveryRepository;
    private final AuctionRepository auctionRepository;

    @GetMapping("/{id}/delivery")
    public ResponseEntity<Delivery> getDelivery(@PathVariable Long id) {
        // Find payment by auction id then delivery
        // In real app, auction -> payment -> delivery
        return ResponseEntity.of(auctionRepository.findById(id)
                .flatMap(auction -> {
                    // This is a simplified lookup since we don't have direct navigation in entity
                    // For now, we return 404 if not found or implement proper repository method
                    return deliveryRepository.findAll().stream()
                            .filter(d -> d.getPayment().getAuction().getId().equals(id))
                            .findFirst();
                }));
    }

    @PostMapping("/{id}/bids")
    public ResponseEntity<Void> placeBid(
            @PathVariable Long id,
            @RequestBody BidRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        auctionService.placeBid(id, request, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Boolean> toggleFavorite(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(auctionService.toggleFavorite(id, userDetails.getUsername()));
    }

    @GetMapping("/{id}/favorite")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(auctionService.isFavorite(id, userDetails.getUsername()));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<AuctionDto>> getFavoriteAuctions(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(auctionService.getFavoriteAuctions(userDetails.getUsername()));
    }

    @GetMapping("/won")
    public ResponseEntity<List<AuctionDto>> getWonAuctions(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(auctionService.getWonAuctions(userDetails.getUsername()));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuctionDto> createAuction(
            @RequestPart("request") AuctionCreateRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(auctionService.createAuction(request, images, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<Page<AuctionDto>> getAllAuctions(
            @RequestParam(required = false) AuctionStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(auctionService.getAllAuctions(status, keyword, category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionDto> getAuction(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getAuction(id));
    }

    @GetMapping("/{id}/bids")
    public ResponseEntity<List<BidDto>> getBids(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getBids(id));
    }
}
