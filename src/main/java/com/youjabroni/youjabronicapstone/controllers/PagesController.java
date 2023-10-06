package com.youjabroni.youjabronicapstone.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Post;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.PostRepository;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PagesController {
    private TournamentRepository tournamentDao;
    private UserRepository userDao;
    private MemeSubmissionRepository memeDao;

    private PostRepository postDao;

    public PagesController(TournamentRepository tournamentDao, UserRepository userDao, MemeSubmissionRepository memeDao, PostRepository postDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
        this.memeDao = memeDao;
        this.postDao = postDao;
    }

    @GetMapping("/home")
    public String showTournaments(Model model) {
        model.addAttribute("tournaments", tournamentDao.findAll());
        return "pages/home";
    }

    @GetMapping("/tournaments/api")
    public @ResponseBody List<Tournament> getTournaments() throws JsonProcessingException {
        List<Tournament> tournaments = tournamentDao.findAll();
//        ObjectMapper mapper = new ObjectMapper();
//        System.out.println("below is tournys");
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
        System.out.println(memes);
        return memes;
    }

    @GetMapping("/{id}/posts")
    public @ResponseBody List<Post> viewAllPostsInJSONFormat(@PathVariable long id) throws JsonProcessingException {
        User user = new User(userDao.findById(id).get());
        List<Post> posts = postDao.findAll();
        List<Post> userPost = new ArrayList<>();
        for (Post post : posts){
            if (post.getUser().getId() == user.getId()){
                userPost.add(post);
            }
        }

        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(posts));
        return userPost;
    }

    @GetMapping("/feed")
    public String showFeed(Model model) {
//        List<MemeSubmission> memes = memeDao.findAll();
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
    public @ResponseBody List<Post> pagesInFeed() throws JsonProcessingException {
        List<Post> posts = postDao.findAll();
        return posts;
    }

    @GetMapping("/leaderboard")
    public @ResponseBody List<Map<String, Object>> showLeaderboard() throws JsonProcessingException {
        List<Tournament> winners = tournamentDao.findAll();
        Map<User, Integer> userWins = new HashMap<>();

        for (Tournament winner : winners) {
            User winnerUser = winner.getWinner();
            userWins.put(winnerUser, userWins.getOrDefault(winnerUser, 0) + 1);
        }

        List<Map.Entry<User, Integer>> sortedWins = new ArrayList<>(userWins.entrySet());
        sortedWins.sort(Map.Entry.<User, Integer>comparingByValue().reversed());

        List<Map<String, Object>> topTen = new ArrayList<>();

        int counter = 0;
        for (Map.Entry<User, Integer> entry : sortedWins) {
            User user = entry.getKey();
            Integer wins = entry.getValue();

            Map<String, Object> userEntry = new HashMap<>();
            userEntry.put("user", user);
            userEntry.put("wins", wins);

            topTen.add(userEntry);
            counter++;

            if (counter == 10) {
                break;
            }
        }

        return topTen;
    }
}
