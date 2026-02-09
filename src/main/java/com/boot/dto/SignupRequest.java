package com.boot.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private String phoneNumber;
    private String address;
    private String detailAddress;
    private boolean privacyAgreed;
}
