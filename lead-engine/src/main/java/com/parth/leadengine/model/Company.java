package com.parth.leadengine.model;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @CsvBindByName(column = "name")
    private String name;

    @CsvBindByName(column = "industry")
    private String industry;

    @CsvBindByName(column = "techStack")
    private String techStack;

    @CsvBindByName(column = "employeeCount")
    private int employeeCount;

    @CsvBindByName(column = "isHiring")
    private boolean isHiring;

    private int score; // This isn't in the CSV, we calculate it in Java
}