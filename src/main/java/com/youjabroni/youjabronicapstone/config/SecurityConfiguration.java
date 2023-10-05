package com.youjabroni.youjabronicapstone.config;

import com.youjabroni.youjabronicapstone.services.UserDetailsLoader;
import org.springframework.cglib.proxy.NoOp;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.thymeleaf.extras.springsecurity6.dialect.SpringSecurityDialect;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private UserDetailsLoader usersLoader;

    public SecurityConfiguration(UserDetailsLoader usersLoader) {
        this.usersLoader = usersLoader;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public PasswordEncoder passwordEncoder(){
//        return NoOpPasswordEncoder.getInstance();
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                        // ignore our stomp endpoints since they are protected using Stomp headers
                        .ignoringRequestMatchers("/secured/**")
                )
                .headers(headers -> headers
                        // allow same origin to frame our site to support iframe SockJS
                        .frameOptions(frameOptions -> frameOptions
                                .sameOrigin()
                        )
                )
                .authorizeHttpRequests((requests) -> requests
                        /* Pages that require authentication
                         * only authenticated users can create and edit ads */
                        .requestMatchers(
                                "/tournament/*",
                                "/tournament/waiting-room/*",
                                "/home",
                                "/*/profile/edit",
                                "/*/profile/edit/password",
                                "/profile/likes",
                                "/*/memeSubmission",
                                "/*/profile/posts"
                        ).authenticated()
                        /* Pages that do not require authentication
                         * anyone can visit the home page, register, login, and view ads */
                        .requestMatchers(
                                "/",
                                "/login",
                                "/register",
                                "/*/profile",
                                "/feed",
                                "/feed/api",
                                "/profile/posts",
                                "/tournaments/api",
                                "/leaderboard"

                        ).permitAll()
                        // allow loading of static resources
                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/img/**"
                        ).permitAll()
                )
                /* Login configuration */
                .formLogin((login) -> login.loginPage("/login").defaultSuccessUrl("/home"))
                /* Logout configuration */
                .logout((logout) -> logout.logoutSuccessUrl("/"));
        return http.build();
    }

}
