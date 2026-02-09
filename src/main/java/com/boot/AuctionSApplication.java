package com.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AuctionSApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuctionSApplication.class, args);
	}

}
