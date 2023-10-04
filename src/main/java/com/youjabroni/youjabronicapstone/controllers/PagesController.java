package com.youjabroni.youjabronicapstone.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class PagesController {
    private TournamentRepository tournamentDao;
    private UserRepository userDao;
    private MemeSubmissionRepository memeDao;

    public PagesController(TournamentRepository tournamentDao, UserRepository userDao, MemeSubmissionRepository memeDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
        this.memeDao = memeDao;
    }

    @GetMapping("/home")
    public String showTournaments(Model model) {
        model.addAttribute("tournaments", tournamentDao.findAll());
        return "pages/home";
    }
    @GetMapping("/tournaments/api")
    public @ResponseBody List<Tournament> getTournaments() throws JsonProcessingException {
        List<Tournament> tournaments = tournamentDao.findAll();
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("below is tournys");
//        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(tournaments));
        return tournaments;
    }

    @GetMapping("/{id}/profile")
    public String showUsersProfile(@PathVariable long id, Model model) {
        int winningCount = 0;
        int tournamentCount = 0;
        List<Tournament> tournamentsUserHasWon = tournamentDao.findByWinnerId(id);
        for(Tournament tournament : tournamentsUserHasWon) {
            winningCount++;
        }
//        List<Tournament> tournamentsUserHasBeenIn = userDao.findAllTournamentById(id);
//        for(Tournament tournament : tournamentsUserHasBeenIn) {
//            tournamentCount++;
//        }

        model.addAttribute("tournaments", tournamentCount);
        model.addAttribute("wins", winningCount);
        model.addAttribute("user", userDao.findById(id).get());
        return "pages/profile";
    }


    @GetMapping("/profile/history")
    public String showSubmissionHistory() {

        return "pages/history";
    }

    @GetMapping("/{id}/memeSubmission")
    public @ResponseBody List<MemeSubmission> viewAllAdsInJSONFormat(@PathVariable long id) {
//        System.out.println("inside viewHistory");
        User user = new User(userDao.findById(id).get());
        List<MemeSubmission> memes = user.getMemeSubmissions();
        return memes;
    }

    @GetMapping("/feed")
    public String showFeed(Model model) {
//        model.addAttribute("MemeSubmission", memeDao.findAll());
        List<MemeSubmission> memes = memeDao.findAll();
//        for (MemeSubmission meme : memes){
//            System.out.println(meme);
//        }
        return "pages/feed";
    }


//    public FeedResponseDTO(List<MemeSubmission> memes, List<User> users) {
//        for (MemeSubmission meme : memeDao.findAll()) {
//            memes.add(meme);
//        }
//        for (MemeSubmission meme : memeDao.findAll()) {
//            for (User user : users) {
//                if (meme.getUser().getId() == user.getId()) {
//                    users.add(user);
//                }
//            }
//        }
//    }

    @GetMapping("/feed/api")
    public @ResponseBody List<User> pagesInFeed() throws JsonProcessingException {
        List<User> users = userDao.findAll();
//        ObjectMapper mapper = new ObjectMapper();
//        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(memes));
        return users;
    }
}
