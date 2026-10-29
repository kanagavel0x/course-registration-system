package com.example.CourseRegistrationSystem.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Entity
public class CourseRegistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String courseName;

    public CourseRegistory (String name, String email, String courseName) {
        this.name = name;
        this.email = email;
        this.courseName = courseName;
    }


}
