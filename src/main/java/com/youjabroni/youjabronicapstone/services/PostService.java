package com.youjabroni.youjabronicapstone.services;

import com.youjabroni.youjabronicapstone.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    private PostRepository posts;

    public PostService(PostRepository posts) {
        this.posts = posts;
    }

    public void deletePostById(long id) {
        posts.deleteById(id);
    }
}
