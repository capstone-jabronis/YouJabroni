package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Post;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.PostRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PostController {

    private PostRepository postDao;
    private UserRepository userDao;
    private MemeSubmissionRepository memeDao;

    public PostController(PostRepository postDao, UserRepository userDao, MemeSubmissionRepository memeDao) {
        this.postDao = postDao;
        this.userDao = userDao;
        this.memeDao = memeDao;
    }

    @PostMapping("/{id}/profile/posts")
    public String addPost(@PathVariable long id, @RequestParam(name = "description") String description, @RequestParam(name = "value") String memeId) {
        System.out.println("inside the post mapping for creating a post");
        long memeSubmissionId = Long.parseLong(memeId);
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDao.findById(currentUser.getId()).get();
        MemeSubmission meme = memeDao.findById(memeSubmissionId).get();
        if(description.trim() == null){
            Post postToSaveWithoutDescription = new Post(user, meme);
            postDao.save(postToSaveWithoutDescription);
        } else if (description.trim() != null) {
            Post postToSaveWithDescription = new Post(
                    description,
                    user,
                    meme
            );
            postDao.save(postToSaveWithDescription);
        }

        return "redirect:/" + user.getId() + "/profile";
    }
}