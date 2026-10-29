package com.example.CourseRegistrationSystem.Controller;

import com.example.CourseRegistrationSystem.Model.Course;
import com.example.CourseRegistrationSystem.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class CourseController {

    @Autowired
    CourseService courseService;

    @GetMapping("/all")
    public List<Course> availableCourses() {
       return courseService.availableCourses();
    }

    @PostMapping("/add")
    public String addCourse(@RequestBody Course course){
        String response = courseService.addCourse(course);
        return response;
    }

    @GetMapping("/enrolled/all")
    public List<Course> enrolledCourses() {
        return courseService.enrolledList();
    }

    @PostMapping("/register")
    public String registerCourse(@RequestParam("name") String name,
                                 @RequestParam("email") String email,
                                 @RequestParam("courseName") String courseName){
       return courseService.registerCourse(name,email,courseName);
    }
}

