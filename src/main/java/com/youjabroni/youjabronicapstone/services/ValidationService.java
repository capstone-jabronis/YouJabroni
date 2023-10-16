package com.youjabroni.youjabronicapstone.services;

import com.youjabroni.youjabronicapstone.controllers.UserController;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class ValidationService {
    private UserRepository userDao;

    public ValidationService(UserRepository userDao) {
        this.userDao = userDao;
    }

    public boolean isValidEmail(String email) {
        String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public boolean emailTaken(String email) {
        List<User> users = userDao.findAll();
        for (User user : users) {
            if (email.toLowerCase() == user.getEmail().toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    public boolean isValidUsername(String username) {
        if (username.contains("") || username.contains(" ")){
            return false;
        } else return true;
    }

    public boolean usernameTaken(String username) {
        List<User> users = userDao.findAll();
        for (User user : users){
            if (user.getUsername().toLowerCase() == username.toLowerCase()){
                return true;
            }
        }
        return false;
    }
}
