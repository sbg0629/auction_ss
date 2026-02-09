package com.boot.service;

import com.boot.dto.UserDto;
import com.boot.entity.User;
import com.boot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String findEmail(String name, String phoneNumber) {
        User user = userRepository.findByNameAndPhoneNumber(name, phoneNumber)
                .orElseThrow(() -> new IllegalArgumentException("User not found with provided name and phone number"));
        return user.getEmail();
    }

    @Transactional
    public void resetPassword(String email, String name, String phoneNumber, String newPassword) {
        User user = userRepository.findByEmailAndNameAndPhoneNumber(email, name, phoneNumber)
                .orElseThrow(() -> new IllegalArgumentException("User not found with provided information"));
        
        user.updatePassword(passwordEncoder.encode(newPassword));
    }

    @Transactional
    public UserDto updateProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (userDto.getName() != null) {
            user.updateName(userDto.getName());
        }
        if (userDto.getAddress() != null) {
            user.updateAddress(userDto.getAddress(), userDto.getDetailAddress());
        }
        if (userDto.getPhoneNumber() != null) {
            user.updatePhoneNumber(userDto.getPhoneNumber());
        }
        
        return UserDto.builder()
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .status(user.getStatus())
                .build();
    }

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return UserDto.builder()
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .status(user.getStatus())
                .build();
    }
}
