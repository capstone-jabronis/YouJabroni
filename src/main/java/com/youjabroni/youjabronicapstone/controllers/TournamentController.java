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
    private TournamentRepository tournamnetDao;

    @GetMapping
    public String showTournaments(Model model){
        model.addAttribute("tournaments", tournamnetDao.findAll());
        return "pages/home";
    }
}
