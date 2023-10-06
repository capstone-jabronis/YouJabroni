package com.youjabroni.youjabronicapstone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import javax.persistence.Entity;

@SpringBootApplication
public class YouJabroniCapstoneApplication {

    public static void main(String[] args) {
        SpringApplication.run(YouJabroniCapstoneApplication.class, args);
    }

}
