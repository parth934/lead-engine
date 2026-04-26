package com.parth.leadengine.controller;

import com.parth.leadengine.model.Company;
import com.parth.leadengine.service.CsvService;
import com.parth.leadengine.service.ScoringService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LeadController {

    private final ScoringService scoringService;
    private final CsvService csvService;

    public LeadController(ScoringService scoringService, CsvService csvService) {
        this.scoringService = scoringService;
        this.csvService = csvService;
    }

    @GetMapping("/leads")
    public List<Company> getLeads() {
        // REPLACE THIS: Provide the path to your actual Kaggle CSV file
        // String path = "C:/Users/PARTH/Downloads/companies_data.csv";
        // If you saved it in Documents, it will look like this:
        String path = "C:/Users/PARTH/Documents/companies.csv";

        List<Company> companies = csvService.readCompaniesFromCsv(path);

        // Score every company in the CSV
        for (Company c : companies) {
            c.setScore(scoringService.calculateScore(c));
        }

        return companies;
    }
}