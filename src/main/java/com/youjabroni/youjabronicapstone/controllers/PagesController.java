package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PagesController {

    private TournamentRepository tournamentDao;

    public PagesController(TournamentRepository tournamentDao) {
        this.tournamentDao = tournamentDao;
    }

    @GetMapping("/home")
    public String showTournaments(Model model){
//        model.addAttribute("tournaments", tournamentDao.findAll());
        return "pages/home";
    }

    @GetMapping("/{id}/profile")
    public String showUsersProfile(@PathVariable long id) {
        return"pages/profile";
    }

    @GetMapping("/feed")
    public String showFeed() {
        return "pages/feed";
    }


}
