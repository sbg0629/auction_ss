package com.boot.repository;

import com.boot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByNameAndPhoneNumber(String name, String phoneNumber);
    Optional<User> findByEmailAndNameAndPhoneNumber(String email, String name, String phoneNumber);
}
