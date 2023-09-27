package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tournament")
public class TournamentController {
    private TournamentRepository tournamentDao;

    private UserRepository userDao;

    @Autowired
    public TournamentController(TournamentRepository tournamentDao, UserRepository userDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
    }

    @GetMapping("/create")
    public String showCreateMemePage() {
        return "tournament/create-meme";
    }

    @GetMapping("/vote")
    public String showVotePage() {
        return "tournament/vote";
    }

    @GetMapping("/complete")
    public String showCompletePage() {
        return "tournament/complete";
    }

    @GetMapping("/waiting-room")
    public String waitingRoom(Model model) {
        model.addAttribute("users", userDao.findAll());
        return "tournament/waiting-room";
    }

}
