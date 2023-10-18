package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import com.youjabroni.youjabronicapstone.services.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class UserController {
    private final UserRepository userDao;
    private final PasswordEncoder passwordEncoder;

    private final ValidationService validationService;

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
        String email = user.getEmail();
        String username = user.getUsername();
        String password = user.getPassword();

        boolean validEmail = false;
        boolean validUsername = false;
        boolean validPassword = false;

        if (validationService.isValidEmail(email) && !validationService.emailTaken(email)) {
            validEmail = true;
        }
        if (validationService.isValidUsername(username) && !validationService.usernameTaken(username)) {
            validUsername = true;
        }
        if (validationService.isValidPassword(password)) {
            validPassword = true;
        }

        if (validEmail && validUsername && validPassword) {
            String hash = passwordEncoder.encode(user.getPassword());
            user.setPassword(hash);
            userDao.save(user);
            return "redirect:/login";
        } else {
            return "redirect:/register";
        }


    }

    @GetMapping("{id}/profile/edit")
    public String showEditForm(@PathVariable long id, Model model) {
        model.addAttribute("user", userDao.findById(id));
        return "pages/edit-profile";
    }

    @PostMapping("{id}/profile/edit")
    public String updateProfile(@PathVariable long id, @RequestParam(name = "username") String username, @RequestParam(name = "email") String email, @RequestParam(name = "ProfileURL") String profileUrl) {
        User user = userDao.findById(id).get();
        // checking to see if username, profileURL and email is the same
        if (profileUrl.equalsIgnoreCase(user.getProfileURL()) && email.equalsIgnoreCase(user.getEmail()) && username.equalsIgnoreCase(user.getUsername())) {
            return String.format("redirect:/%s/profile", id);
            //checking to see if username is changed
        } else if (profileUrl.equalsIgnoreCase(user.getProfileURL()) && email.equalsIgnoreCase(user.getEmail()) && !username.equalsIgnoreCase(user.getUsername())) {
            // checking to see if username is valid and not taken
            if (validationService.isValidUsername(username) && !validationService.usernameTaken(username)) {
                user.setUsername(username);
                userDao.save(user);
                //all else fails redirect
            }
            return String.format("redirect:/%s/profile", id);
            //checking to see if username and email are changed
        } else if (profileUrl.equalsIgnoreCase(user.getProfileURL()) && !email.equalsIgnoreCase(user.getEmail()) && !username.equalsIgnoreCase(user.getUsername())) {
            //checking to see if username and email is valid and not taken
            if (validationService.isValidUsername(username) && !validationService.usernameTaken(username) && validationService.isValidEmail(email) && !validationService.emailTaken(email)) {
                user.setUsername(username);
                user.setEmail(email);
                userDao.save(user);
                //all else fails redirect
            }
            return String.format("redirect:/%s/profile", id);
            //checking to see email, username, and profile pic are changed
        } else if (!profileUrl.equalsIgnoreCase(user.getProfileURL()) && !email.equalsIgnoreCase(user.getEmail()) && !username.equalsIgnoreCase(user.getUsername())) {
            //checking username and email is valid and not taken and verifying that the profile picture url is not null
            if (validationService.isValidUsername(username) && !validationService.usernameTaken(username) && validationService.isValidEmail(email) && !validationService.emailTaken(email) && validationService.validProfileURL(profileUrl)) {
                user.setUsername(username);
                user.setEmail(email);
                user.setProfileURL(profileUrl);
                userDao.save(user);
                //all else fails redirect
            }
            return String.format("redirect:/%s/profile", id);
            //checking to see if email is changed
        } else if (profileUrl.equalsIgnoreCase(user.getProfileURL()) && !email.equalsIgnoreCase(user.getEmail()) && username.equalsIgnoreCase(user.getUsername())) {
            //checking to see if email is valid and not taken
            if (validationService.isValidEmail(email) && !validationService.emailTaken(email)) {
                user.setEmail(email);
                userDao.save(user);
                //all else fails redirect
            }
            return String.format("redirect:/%s/profile", id);
            //checking to see if email and profile pic are changed
        } else if (!profileUrl.equalsIgnoreCase(user.getProfileURL()) && !email.equalsIgnoreCase(user.getEmail()) && username.equalsIgnoreCase(user.getUsername())) {
            //checking valid profile url and email
            if (validationService.isValidEmail(email) && !validationService.emailTaken(email) && validationService.validProfileURL(profileUrl)) {
                user.setEmail(email);
                user.setProfileURL(profileUrl);
                userDao.save(user);
                //all else fails redirect
            }
            return String.format("redirect:/%s/profile", id);
            //checking to see if profile pic is changed
        } else if (!profileUrl.equalsIgnoreCase(user.getProfileURL()) && email.equalsIgnoreCase(user.getEmail()) && username.equalsIgnoreCase(user.getUsername())) {
            //checking valid profile url
            if (validationService.validProfileURL(profileUrl)) {
                user.setProfileURL(profileUrl);
                userDao.save(user);
                //all else fails redirect
            }
            return String.format("redirect:/%s/profile", id);
            //checking to see if profile picture and username are changed
        } else if (!profileUrl.equalsIgnoreCase(user.getProfileURL()) && email.equalsIgnoreCase(user.getEmail()) && !username.equalsIgnoreCase(user.getUsername()))
            if (validationService.isValidUsername(username) && !validationService.usernameTaken(username) && validationService.validProfileURL(profileUrl)) {
                user.setProfileURL(profileUrl);
                user.setUsername(username);
                userDao.save(user);
                return String.format("redirect:/%s/profile", id);
                //all else fails redirect
            } else {
                return String.format("redirect:/%s/profile", id);
            }
            //all else fails redirect
        else {
            return String.format("redirect:/%s/profile", id);
        }
    }

    @PostMapping("{id}/profile/edit/password")
    public String updatePassword(@PathVariable long id, @RequestParam(name = "newPassword") String newPassword) {
        User user = userDao.findById(id).get();
        if (validationService.isValidPassword(newPassword)){
            String hash = passwordEncoder.encode(newPassword);
            user.setPassword(hash);
            userDao.save(user);
        }
        return String.format("redirect:/%s/profile", id);
    }

    @GetMapping("/users")
    public @ResponseBody List<User> checkUsername() {
        List<User> users = userDao.findAll();
        return users;
    }


}