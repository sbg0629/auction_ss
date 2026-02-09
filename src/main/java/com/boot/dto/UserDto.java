package com.boot.dto;

import com.boot.type.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String email;
    private String name;
    private String phoneNumber;
    private String address;
    private String detailAddress;
    private UserStatus status;
}
