package com.example.CourseRegistrationSystem.Controller;
import com.example.CourseRegistrationSystem.Model.CourseRegistory;
import com.example.CourseRegistrationSystem.Service.CourseRegistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class CourseRegistoryController {

    @Autowired
    CourseRegistoryService courseRegistoryService;

    @GetMapping("/enrolled")
    public List<CourseRegistory> courseRegistrationDetails() {
        return courseRegistoryService.courseRegistrationDetails();
    }
}
