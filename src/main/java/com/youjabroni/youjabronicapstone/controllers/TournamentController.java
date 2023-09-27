package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
public class TournamentController {
    private TournamentRepository tournamentDao;

    public TournamentController(TournamentRepository tournamentDao) {
        this.tournamentDao = tournamentDao;
    }

    @GetMapping("/tournament/join")
    public String showWaitingRoom() {
        return "tournament/join";
    }

    @GetMapping("/tournament/create")
    public String showCreateMemePage() {
        return "tournament/create-meme";
    }

    @GetMapping("/tournament/vote")
    public String showVotePage() {
        return "tournament/vote";
    }

    @GetMapping("/tournament/complete")
    public String showCompletePage() {
        return "tournament/complete";
    }
}
