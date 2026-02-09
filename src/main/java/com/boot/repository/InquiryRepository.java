package com.boot.repository;

import com.boot.entity.Inquiry;
import com.boot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByAuthorOrderByCreatedAtDesc(User author);
    List<Inquiry> findAllByOrderByCreatedAtDesc();
}
