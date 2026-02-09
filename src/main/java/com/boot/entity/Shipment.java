package com.boot.entity;

import com.boot.type.ShipmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String receiverName;
    private String address;
    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.READY;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
