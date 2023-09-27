package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tournaments")
public class TournamentController {
    private TournamentRepository tournamentDao;
    private UserRepository userDao;

    public TournamentController(TournamentRepository tournamentDao, UserRepository userDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
    }

    @GetMapping("/home")
    public String showTournaments(Model model){
        model.addAttribute("tournaments", tournamentDao.findAll());
        model.addAttribute("users", userDao.findAll());
        for (User user : userDao.findAll()){
            System.out.println(user.getUsername());
        }
        return "pages/home";
    }
    @GetMapping("waitingroom")
    public String waitingRoom (Model model){
        model.addAttribute("users", userDao.findAll());
        return "tournament/waitingRoom";
    }

}
