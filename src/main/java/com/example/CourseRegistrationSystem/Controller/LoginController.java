package com.example.CourseRegistrationSystem.Controller;

import com.example.CourseRegistrationSystem.Model.Users;
import com.example.CourseRegistrationSystem.Service.MyUserDetailsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class LoginController {

    @Autowired
    MyUserDetailsServices myUserDetailsServices;

    @GetMapping("/Login")
    public String login() {
        return "redirect:/login.html";
    }

    @GetMapping("/register")
    public String register() {
        return "redirect:/register.html";
    }

    @PostMapping("/register-user")
    public ResponseEntity<String> registerUser(@RequestBody Users user) {
        try {
            myUserDetailsServices.addUser(user);
            return ResponseEntity.ok("User registered successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}
