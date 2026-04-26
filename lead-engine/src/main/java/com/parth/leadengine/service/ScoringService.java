package com.parth.leadengine.service;

import com.parth.leadengine.model.Company;
import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    public int calculateScore(Company company) {
        int points = 0;
        if (company.getTechStack() != null &&
                (company.getTechStack().contains("Java") || company.getTechStack().contains("React"))) {
            points += 50;
        }
        if (company.isHiring()) {
            points += 30;
        }
        if (company.getEmployeeCount() > 500) {
            points += 20;
        }
        return points;
    }
}