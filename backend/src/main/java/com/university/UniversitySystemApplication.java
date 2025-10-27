package com.university;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UniversitySystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(UniversitySystemApplication.class, args);
	}

}
