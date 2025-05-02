package com.pjb2.rental_car;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableScheduling
@SpringBootApplication
public class RentalCarApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalCarApplication.class, args);
		PasswordEncoder encoder = new BCryptPasswordEncoder();
		System.out.println(encoder.encode("Cpa123@"));

	}

}
