package com.example.CourseRegistrationSystem.Service;

import com.example.CourseRegistrationSystem.Model.MyUserPrincipal;
import com.example.CourseRegistrationSystem.Model.Users;
import com.example.CourseRegistrationSystem.Repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsServices implements UserDetailsService {

    @Autowired
    UsersRepo usersRepo;

    @Autowired
    @Lazy
    PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepo.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return new MyUserPrincipal(user);
    }

    public void addUser(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usersRepo.save(user);
    }
}
