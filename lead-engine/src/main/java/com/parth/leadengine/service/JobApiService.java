package com.parth.leadengine.service;

import com.parth.leadengine.model.Company;
import com.parth.leadengine.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class JobApiService {

    private final CompanyRepository companyRepository;
    private final ScoringService scoringService;
    private final RestTemplate restTemplate;

    // Inject RestTemplate here so we can call the live internet
    public JobApiService(CompanyRepository companyRepository, ScoringService scoringService, RestTemplate restTemplate) {
        this.companyRepository = companyRepository;
        this.scoringService = scoringService;
        this.restTemplate = restTemplate;
    }

    // Runs every 5 minutes (300000 milliseconds) to fetch live internet data
    @Scheduled(fixedRate = 300000)
    public void fetchLiveJobLeads() {
        System.out.println("🌐 Connecting to live internet job board API...");

        // A live, open API endpoint that gives real tech job postings in JSON format
        String url = "https://www.arbeitnow.com/api/job-board-api";

        try {
            // Make the live outbound network call
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("data")) {
                List<Map<String, Object>> jobs = (List<Map<String, Object>>) response.get("data");

                System.out.println("📥 Successfully downloaded " + jobs.size() + " live job postings!");

                for (Map<String, Object> job : jobs) {
                    String companyName = (String) job.get("company_name");
                    String industry = (String) job.get("slug"); // API categorization tag

                    // Extracting details from the live payload
                    List<String> tags = (List<String>) job.get("tags");
                    String techStack = (tags != null) ? String.join(", ", tags) : "Tech";

                    // Business Constraint: Avoid duplicate rows in your PostgreSQL table
                    boolean exists = companyRepository.findAll().stream()
                            .anyMatch(c -> c.getName().equalsIgnoreCase(companyName));

                    if (!exists) {
                        Company c = new Company();
                        c.setName(companyName);
                        c.setIndustry("Technology");
                        c.setTechStack(techStack);
                        c.setEmployeeCount(250); // Default placeholder estimation
                        c.setHiring(true);

                        // Pass the real internet data through your logic engine
                        c.setScore(scoringService.calculateScore(c));
                        c.setStatus(scoringService.determineStatus(c.getScore()));

                        // Persist it!
                        companyRepository.save(c);
                        System.out.println("💾 Live Lead Saved: " + companyName + " [" + c.getStatus() + "]");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Network Error while fetching real-time leads: " + e.getMessage());
        }
    }
}