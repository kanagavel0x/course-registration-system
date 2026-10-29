package com.example.CourseRegistrationSystem.Repository;

import com.example.CourseRegistrationSystem.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository<Users,Integer> {
    public Users findByUsername(String username);
}
