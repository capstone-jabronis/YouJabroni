package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import com.youjabroni.youjabronicapstone.services.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class UserController {
    private UserRepository userDao;
    private PasswordEncoder passwordEncoder;

    private ValidationService validationService;

    @Autowired
    public UserController(UserRepository userDao, PasswordEncoder passwordEncoder, ValidationService validationService) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.validationService = validationService;
    }

    @GetMapping("/register")
    public String showSignupForm(Model model) {
        model.addAttribute("user", new User());
        return "users/register";
    }

    @PostMapping("/register")
    public String saveUser(@ModelAttribute User user) {
        //validation for username


        String hash = passwordEncoder.encode(user.getPassword());
        user.setPassword(hash);
        userDao.save(user);
        return "redirect:/login";
    }

    @GetMapping("{id}/profile/edit")
    public String showEditForm(@PathVariable long id, Model model) {
        model.addAttribute("user", userDao.findById(id).get());
        return "pages/edit-profile";
    }

    @PostMapping("{id}/profile/edit")
    public String updateProfile(@PathVariable long id, @RequestParam(name = "username") String username, @RequestParam(name = "email") String email, @RequestParam(name = "ProfileURL") String profileUrl) {
        User user = userDao.findById(id).get();
        //checking email validation
        if (validationService.isValidEmail(email)) {
            if (!validationService.emailTaken(email)) {
                user.setEmail(email);
            } else {
                return String.format("redirect:/%s/profile?error=emailTaken", id);
            }
        } else {
            return String.format("redirect:/%s/profile?error=invalidEmail", id);
        }

        //checking usernamevalidation
        if (validationService.isValidUsername(username) && !validationService.usernameTaken(username)) {
            user.setUsername(username);
            userDao.save(user);
        } else {
            return String.format("redirect:/%s/profile", id);
        }
        //validation for profileURL
        if (profileUrl != null) {
            user.setProfileURL(profileUrl);
            userDao.save(user);
        } else {
            return String.format("redirect:/%s/profile?error=invalidEmail", id);
        }
        return String.format("redirect:/%s/profile", id);
    }

    @PostMapping("{id}/profile/edit/password")
    public String updatePassword(@PathVariable long id, @RequestParam(name = "newPassword") String newPassword) {
        User user = userDao.findById(id).get();
        if (newPassword != "") {
            String hash = passwordEncoder.encode(newPassword);
            user.setPassword(hash);
            userDao.save(user);
        } else {
            return String.format("redirect:/%s/profile", id);
        }

        return String.format("redirect:/%s/profile", id);
    }

    @GetMapping("/users")
    public @ResponseBody List<User> checkUsername() {
        List<User> users = userDao.findAll();
        return users;
    }


}