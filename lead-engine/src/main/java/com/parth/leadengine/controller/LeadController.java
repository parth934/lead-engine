package com.parth.leadengine.controller;

import com.parth.leadengine.model.Company;
import com.parth.leadengine.repository.CompanyRepository;
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
    private final CompanyRepository companyRepository;

    public LeadController(ScoringService scoringService, CsvService csvService, CompanyRepository companyRepository) {
        this.scoringService = scoringService;
        this.csvService = csvService;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/leads")
    public Company addLead(@RequestBody Company company) {
        // Calculate score before saving
        company.setScore(scoringService.calculateScore(company));
        company.setStatus(scoringService.determineStatus(company.getScore())); // set score label like hot cool
        // Save to PostgreSQL
        return companyRepository.save(company);
    }

    @DeleteMapping("/leads/{id}")
    public void deleteLead(@PathVariable Long id) {
        companyRepository.deleteById(id);
    }

    @GetMapping("/leads")
    public List<Company> getLeads() {
        // 1. Check if database is empty
        if (companyRepository.count() == 0) {
            System.out.println("Database is empty. Importing from CSV...");

            String path = "C:/Users/PARTH/Documents/companies.csv";
            List<Company> csvLeads = csvService.readCompaniesFromCsv(path);

            // 2. Score them and Save to Database
            for (Company c : csvLeads) {
                c.setScore(scoringService.calculateScore(c));
                c.setStatus(scoringService.determineStatus(c.getScore()));
                companyRepository.save(c); // This saves the row to Postgres!
            }
        }

        // 3. Always return the data from the Database
        return companyRepository.findAll();
    }
}