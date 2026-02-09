package com.boot.entity;

import com.boot.type.Provider;
import com.boot.type.UserRole;
import com.boot.type.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    private String detailAddress;

    @Column(nullable = false)
    private boolean privacyAgreed;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    private String providerId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    private LocalDateTime bannedUntil;

    private String banReason;

    public void updateName(String name) {
        this.name = name;
    }

    public void updateAddress(String address, String detailAddress) {
        this.address = address;
        this.detailAddress = detailAddress;
    }

    public void updatePhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateStatus(UserStatus status) {
        this.status = status;
    }

    public void ban(LocalDateTime bannedUntil, String banReason) {
        this.status = UserStatus.BANNED;
        this.bannedUntil = bannedUntil;
        this.banReason = banReason;
    }

    public void unban() {
        this.status = UserStatus.ACTIVE;
        this.bannedUntil = null;
        this.banReason = null;
    }
}
