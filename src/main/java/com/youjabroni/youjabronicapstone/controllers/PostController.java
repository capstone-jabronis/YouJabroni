package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Post;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.PostRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

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
    public String addPost(@PathVariable long id, @RequestParam(name = "description") String description, @RequestParam(name = "meme-id") long memeId) {
        System.out.println("inside the post mapping for creating a post");
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDao.findById(currentUser.getId()).get();
        MemeSubmission meme = memeDao.findById(memeId).get();
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
//        return "redirect:/home";
    }
//    @PostMapping("/{id}/profile/posts")
//    public String addPost (@PathVariable long id, Model model){
//        User user = userDao.findById(id).get();
//        MemeSubmission meme = (MemeSubmission) model.getAttribute("add-img");
//        Post addpost = new Post();
//                addpost.setDescription((String) model.getAttribute("add-caption"));
//                addpost.setUser(user);
//                addpost.setMemeSubmission((MemeSubmission) model.getAttribute("add-img"));
//
//                postDao.save(addpost);
//        return "redirect:/" + user.getId() + "/profile";
//    }
}
