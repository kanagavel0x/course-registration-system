package com.example.CourseRegistrationSystem.Repository;

import com.example.CourseRegistrationSystem.Model.CourseRegistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRegistoryRepo extends JpaRepository<CourseRegistory, Integer> {

}
