package com.parth.leadengine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling // 1. This turns on the "Alarm Clock" feature for background tasks
public class LeadEngineApplication {

	public static void main(String[] academ) {
		SpringApplication.run(LeadEngineApplication.class, academ);
	}

	@Bean // 2. This registers the internet-calling tool
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}