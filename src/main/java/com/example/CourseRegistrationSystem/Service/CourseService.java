package com.example.CourseRegistrationSystem.Service;

import com.example.CourseRegistrationSystem.Model.Course;
import com.example.CourseRegistrationSystem.Model.CourseRegistory;
import com.example.CourseRegistrationSystem.Repository.CourseRegistoryRepo;
import com.example.CourseRegistrationSystem.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    CourseRegistoryRepo courseRegistoryRepo;

    public List<Course> availableCourses() {
        return courseRepository.findAll();
    }

    public String addCourse(Course course) {
        courseRepository.save(course);
        return "Course Added";
    }

    public String registerCourse(String name, String email, String courseName) {
        courseRegistoryRepo.save(new CourseRegistory(name,email,courseName));
        return "Course Registered";
    }

    public List<Course> enrolledList() {
        return courseRepository.findAll();
    }
}
