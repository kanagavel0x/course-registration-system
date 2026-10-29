package com.example.CourseRegistrationSystem.Service;

import com.example.CourseRegistrationSystem.Model.CourseRegistory;
import com.example.CourseRegistrationSystem.Repository.CourseRegistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseRegistoryService {

    @Autowired
    CourseRegistoryRepo courseRegistoryRepo;

    public List<CourseRegistory> courseRegistrationDetails() {
        return courseRegistoryRepo.findAll();
    }
}
