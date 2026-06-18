package com.parth.leadengine.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "companies")
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String industry;
    private String techStack;
    private int employeeCount;
    private boolean isHiring;
    private int score;
    private String status; // HOT, WARM, COLD
}