package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

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

    @GetMapping("/feed")
    public String showFeed() {
        return "pages/feed";
    }


}
