package com.example.CourseRegistrationSystem.Repository;

import com.example.CourseRegistrationSystem.Model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
}
