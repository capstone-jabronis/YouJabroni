package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PagesController {

    private TournamentRepository tournamentDao;
    private UserRepository userDao;

    public PagesController(TournamentRepository tournamentDao, UserRepository userDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
    }

    @GetMapping("/home")
    public String showTournaments(Model model){
        model.addAttribute("tournaments", tournamentDao.findAll());
        model.addAttribute("users", userDao.findAll());
        for (User user : userDao.findAll()) {
            System.out.println(user.getUsername());
        }
        return "pages/home";
    }

    @GetMapping("/{id}/profile")
    public String showUsersProfile(@PathVariable long id, Model model) {
        model.addAttribute("user", userDao.findById(id).get());
        return"pages/profile";
    }

    @GetMapping("/{id}/profile/edit")
    public String profileEdit(Model model,@PathVariable long id){
        model.addAttribute("user", userDao.findById(id).get());
        return "pages/edit-profile";
    }

    @PostMapping("/{id}/profile/edit")
    public String insertEdit(@ModelAttribute User user, @PathVariable long id){
        User userToEdit = userDao.findById(id).get();
        userToEdit.setUsername(user.getUsername());
        userToEdit.setEmail(user.getEmail());
        userToEdit.setProfileURL(user.getProfileURL());
        userDao.save(userToEdit);
        return String.format("redirect:/%s/profile", id);
    }

    @GetMapping("/feed")
    public String showFeed() {
        return "pages/feed";
    }

    @GetMapping("/profile/posts")
    public String showPosts() {
        return "pages/posts";
    }

    @GetMapping("/profile/likes")
    public String showLikedPosts() {
        return "pages/likes";
    }

    @GetMapping("/profile/history")
    public String showSubmissionHistory() {
        return "pages/history";
    }
}
