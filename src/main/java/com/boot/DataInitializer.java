package com.boot;

import com.boot.entity.Auction;
import com.boot.entity.Item;
import com.boot.entity.User;
import com.boot.repository.AuctionRepository;
import com.boot.repository.ItemRepository;
import com.boot.repository.UserRepository;
import com.boot.type.AuctionStatus;
import com.boot.type.Provider;
import com.boot.type.UserRole;
import com.boot.type.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final AuctionRepository auctionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Create Users
        User seller = User.builder()
                .email("seller@test.com")
                .password(passwordEncoder.encode("password"))
                .name("도자기장인")
                .provider(Provider.LOCAL)
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();
        
        User buyer = User.builder()
                .email("buyer@test.com")
                .password(passwordEncoder.encode("password"))
                .name("수집가")
                .provider(Provider.LOCAL)
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.saveAll(Arrays.asList(seller, buyer));

        // 2. Create Items
        Item item1 = Item.builder()
                .seller(seller)
                .title("고려 청자 운학문 매병")
                .description("국보급 고려 청자입니다. 아름다운 학 무늬가 특징입니다.")
                .category("청자")
                .build();

        Item item2 = Item.builder()
                .seller(seller)
                .title("조선 백자 달항아리")
                .description("단아하고 순수한 아름다움을 지닌 조선 백자입니다.")
                .category("백자")
                .build();
        
        Item item3 = Item.builder()
                .seller(seller)
                .title("분청사기 인화문 대접")
                .description("소박하면서도 자유분방한 분청사기입니다.")
                .category("분청사기")
                .build();

        itemRepository.saveAll(Arrays.asList(item1, item2, item3));

        // 3. Create Auctions
        Auction auction1 = Auction.builder()
                .item(item1)
                .startPrice(10000000L)
                .currentPrice(10000000L)
                .minBidUnit(500000L)
                .startAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusDays(7))
                .status(AuctionStatus.RUNNING)
                .build();

        Auction auction2 = Auction.builder()
                .item(item2)
                .startPrice(5000000L)
                .currentPrice(5500000L)
                .minBidUnit(100000L)
                .startAt(LocalDateTime.now().minusDays(1))
                .endAt(LocalDateTime.now().plusDays(5))
                .status(AuctionStatus.RUNNING)
                .build();
        
        Auction auction3 = Auction.builder()
                .item(item3)
                .startPrice(1000000L)
                .currentPrice(1200000L)
                .minBidUnit(50000L)
                .startAt(LocalDateTime.now().minusDays(2))
                .endAt(LocalDateTime.now().minusHours(1)) // Ended
                .status(AuctionStatus.ENDED)
                .build();

        auctionRepository.saveAll(Arrays.asList(auction1, auction2, auction3));
        
        System.out.println("Dummy data initialized!");
    }
}
