package com.boot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "deliveries")
public class Delivery extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(nullable = false)
    private String courierName; // CJ대한통운, 우체국택배

    @Column(nullable = false)
    private String trackingNumber;

    @Column(nullable = false)
    private String status; // PREPARING, SHIPPING, DELIVERED
}
