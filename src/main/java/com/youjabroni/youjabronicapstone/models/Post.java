package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column
    private String description;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "post")
    private List<Like> likes;
    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "meme_id")
    private MemeSubmission memeSubmission;

    public Post() {
    }

    public Post(long id, String description, User user, List<Like> likes) {
        this.id = id;
        this.description = description;
        this.user = user;
        this.likes = likes;
    }

    public Post(String description, User user, MemeSubmission memeSubmission) {
        this.description = description;
        this.user = user;
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

    public List<Like> getLikes() {
        return likes;
    }

    public void setLikes(List<Like> likes) {
        this.likes = likes;
    }

    public MemeSubmission getMemeSubmission() {
        return memeSubmission;
    }

    public void setMemeSubmission(MemeSubmission memeSubmission) {
        this.memeSubmission = memeSubmission;
    }
}
