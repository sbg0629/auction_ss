package com.boot.service;

import com.boot.dto.NotificationDto;
import com.boot.entity.Notification;
import com.boot.entity.User;
import com.boot.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendNotification(User user, String message, Long auctionId) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .relatedAuctionId(auctionId)
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // Push via WebSocket
        messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), convertToDto(notification));
    }

    public List<NotificationDto> getNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.markAsRead();
    }

    private NotificationDto convertToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .relatedAuctionId(notification.getRelatedAuctionId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
