package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/tournament")
public class TournamentController {
    private TournamentRepository tournamentDao;
    private MemeSubmissionRepository memeSubmissionDao;
    private UserRepository userDao;

    @Autowired
    public TournamentController(TournamentRepository tournamentDao, UserRepository userDao, MemeSubmissionRepository memeSubmissionDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
        this.memeSubmissionDao = memeSubmissionDao;
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
    @GetMapping("/profile/{id}")
    public String profileView (Model model,@PathVariable long id){
        model.addAttribute("user", userDao.findById(id).get());
        return "pages/profile";
    }

    @GetMapping("/profile/{id}/edit")
    public String profileEdit(Model model,@PathVariable long id){
        model.addAttribute("user", userDao.findById(id).get());
        return "pages/editProfile";
    }
    @PostMapping("/profile/{id}/edit")
    public String insertEdit(@ModelAttribute User user, @PathVariable long id){
        User userToEdit = userDao.findById(id).get();
        userToEdit.setUsername(user.getUsername());
        userToEdit.setEmail(user.getEmail());
        userDao.save(userToEdit);
        return "redirect:/profile/"+id;
    }
}
