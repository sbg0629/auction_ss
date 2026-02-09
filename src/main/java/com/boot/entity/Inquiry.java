package com.boot.entity;

import com.boot.type.InquiryStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "inquiries")
public class Inquiry extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answerer_id")
    private User answerer;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.PENDING;

    public void answer(String answer, User answerer) {
        this.answer = answer;
        this.answerer = answerer;
        this.status = InquiryStatus.ANSWERED;
    }
}
