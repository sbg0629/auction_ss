package com.boot.service;

import org.springframework.stereotype.Service;

@Service
public class IdentityVerificationService {

    public boolean verifyIdentity(String phoneNumber, String name) {
        // Simulation: Always returns true if phone number starts with 010
        // In production, integrate with PASS, KCB, or NiceID API
        return phoneNumber != null && phoneNumber.startsWith("010") && name != null && !name.isEmpty();
    }
}
