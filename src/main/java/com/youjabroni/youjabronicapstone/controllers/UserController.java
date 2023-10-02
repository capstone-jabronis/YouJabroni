package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserController {
    private UserRepository userDao;
    private PasswordEncoder passwordEncoder;

    public UserController(UserRepository userDao,PasswordEncoder passwordEncoder
    ) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }
    @GetMapping("/register")
    public String showSignupForm(Model model){
        model.addAttribute("user", new User());
        return "users/register";
    }

    @PostMapping("/register")
    public String saveUser(@ModelAttribute User user){
        String hash = passwordEncoder.encode(user.getPassword());
        user.setPassword(hash);
        userDao.save(user);
        return "redirect:/login";
    }

    @GetMapping("{id}/profile/edit")
    public String showEditForm(@PathVariable long id, Model model ) {
        model.addAttribute("user", userDao.findById(id).get());
        return "pages/edit-profile";
    }

    @PostMapping("{id}/profile/edit")
    public String updateProfile(@PathVariable long id, @RequestParam(name = "username") String username, @RequestParam(name = "email") String email) {
        User user = userDao.findById(id).get();
        user.setEmail(email);
        user.setUsername(username);
        userDao.save(user);
        return String.format("redirect:/%s/profile", id);
    }


}