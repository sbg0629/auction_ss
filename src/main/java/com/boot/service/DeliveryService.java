package com.boot.service;

import com.boot.entity.Delivery;
import com.boot.entity.Payment;
import com.boot.repository.DeliveryRepository;
import com.boot.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public void registerTracking(Long paymentId, String courierName, String trackingNumber) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        Delivery delivery = Delivery.builder()
                .payment(payment)
                .courierName(courierName)
                .trackingNumber(trackingNumber)
                .status("SHIPPING")
                .build();
        
        deliveryRepository.save(delivery);
    }

    // Smart Courier API Simulation
    public String getTrackingInfo(String courierName, String trackingNumber) {
        // In production, call Smart Courier API (https://info.sweettracker.co.kr/api/v1/trackingInfo)
        return "현재 " + courierName + "에서 배송 중입니다. (송장번호: " + trackingNumber + ")";
    }
}
