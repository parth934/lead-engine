package com.parth.leadengine.service;

import com.opencsv.bean.CsvToBeanBuilder;
import com.parth.leadengine.model.Company;
import org.springframework.stereotype.Service;
import java.io.FileReader;
import java.util.List;

@Service
public class CsvService {

    public List<Company> readCompaniesFromCsv(String filePath) {
        try {
            return new CsvToBeanBuilder<Company>(new FileReader(filePath))
                    .withType(Company.class)
                    .build()
                    .parse();
        } catch (Exception e) {
            throw new RuntimeException("Could not read CSV file: " + e.getMessage());
        }
    }
}