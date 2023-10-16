package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
//import jakarta.persistence.*;
import javax.persistence.*;

import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column
    private String description;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "likes",
            joinColumns = {@JoinColumn(name = "post_id")},
            inverseJoinColumns = {@JoinColumn(name="user_id")}
    )
    private List<User> userLikes;


    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "meme_id")
    private MemeSubmission memeSubmission;

    public Post() {
    }

    public Post(String description, User user, MemeSubmission memeSubmission) {
        this.description = description;
        this.user = user;
        this.memeSubmission = memeSubmission;
    }

    public Post(long id, String description, User user, List<User> userLikes, MemeSubmission memeSubmission) {
        this.id = id;
        this.description = description;
        this.user = user;
        this.userLikes = userLikes;
        this.memeSubmission = memeSubmission;
    }

    public Post(User user, MemeSubmission memeSubmission) {
        this.user = user;
        this.memeSubmission = memeSubmission;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public MemeSubmission getMemeSubmission() {
        return memeSubmission;
    }

    public void setMemeSubmission(MemeSubmission memeSubmission) {
        this.memeSubmission = memeSubmission;
    }
    public List<User> getUserLikes() {
        return userLikes;
    }

    public void setUserLikes(List<User> userLikes) {
        this.userLikes = userLikes;
    }
}
