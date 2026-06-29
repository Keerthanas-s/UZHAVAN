package com.uzhavan.uzhavan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class UzhavanApplication {

    public static void main(String[] args) {
        SpringApplication.run(UzhavanApplication.class, args);
    }

}