package com.example.CourseRegistrationSystem.Configuration;

import com.example.CourseRegistrationSystem.Service.MyUserDetailsServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(request -> {
                    request.requestMatchers(
                            "/Login",
                            "/login",
                            "/login.html",
                            "/register",
                            "/register.html",
                            "/register-user"

                    ).permitAll();
                    request.anyRequest().authenticated();
                })
                .formLogin(form -> {
                    form.loginPage("/Login");
                    form.loginProcessingUrl("/login");
                    form.defaultSuccessUrl("/index.html", true);
                    form.failureUrl("/Login?error=true");
                    form.permitAll();
                })
                .logout(logout -> {
                    logout.logoutUrl("/logout");
                    logout.logoutSuccessUrl("/Login?logout=true");
                    logout.invalidateHttpSession(true);
                    logout.deleteCookies("JSESSIONID");
                    logout.permitAll();
                })
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            MyUserDetailsServices myUserDetailsServices,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(myUserDetailsServices);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}
