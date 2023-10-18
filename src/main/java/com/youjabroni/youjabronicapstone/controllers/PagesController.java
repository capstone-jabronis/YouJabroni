package com.youjabroni.youjabronicapstone.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.youjabroni.youjabronicapstone.models.*;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.PostRepository;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import java.security.Principal;
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
        int postsCount = 0;
        int postLikes = 0;

        List<Tournament> tournamentsUserHasWon = tournamentDao.findByWinnerId(id);
        for(Tournament tournament : tournamentsUserHasWon) {
            winningCount++;
        }

        List<Post> allUserPosts = postDao.findByUserId(id);
        for(Post post : allUserPosts) {
            postsCount++;
        }

        List<Post> userLikedPosts = postDao.findByUserId(id);
        for(Post post : userLikedPosts)
        {
            List<User> totalLikes = post.getUserLikes();
            for(User user : totalLikes) {
                postLikes++;
            }
        }

        model.addAttribute("wins", winningCount);
        model.addAttribute("posts", postsCount);
        model.addAttribute("likes", postLikes);
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

        return userPost;
    }
    @GetMapping("/{id}/liked")
    public @ResponseBody List<Post> viewLikedPosts(@PathVariable long id) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        User user = new User(userDao.findById(id).get());
        List<Post> userLikedPosts = postDao.findAllByUserLikes(user);
//        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(userLikedPosts));
        return userLikedPosts;
    }

    @GetMapping("/feed")
    public String showFeed(Model model) {
        return "pages/feed";
    }
    @PostMapping("/{postId}/liked")
    @ResponseBody
    public Post showLiked(@PathVariable long postId){
        User user = userDao.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        Post post = postDao.findById(postId).get();
        List<User> userLikes = post.getUserLikes();
        List<Post> userLikesPosts = user.getLikedPosts();
        if(userLikes.contains(user)){
            userLikes.remove(user);
            userLikesPosts.remove(post);
        } else {
            userLikes.add(user);
            userLikesPosts.add(post);
        }
        post.setUserLikes(userLikes);
        user.setLikedPosts(userLikesPosts);
        postDao.save(post);
        userDao.save(user);
        return post;
    }

    @GetMapping("/feed/api")
    public @ResponseBody List<Post> pagesInFeed() throws JsonProcessingException {
        List<Post> posts = postDao.findAll();
        Collections.reverse(posts);
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
    @GetMapping("/about-us")
    public String aboutUs(){
        return "pages/about-us";
    }
}
