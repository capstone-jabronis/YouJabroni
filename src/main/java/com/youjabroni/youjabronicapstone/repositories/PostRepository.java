package com.youjabroni.youjabronicapstone.repositories;

import com.youjabroni.youjabronicapstone.models.Post;
import com.youjabroni.youjabronicapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(long id);
}
