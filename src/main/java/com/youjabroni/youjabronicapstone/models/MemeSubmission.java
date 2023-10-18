package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
//import jakarta.persistence.*;
import javax.persistence.*;
@Getter
@Setter
@Entity
@Table(name = "meme_submission")
public class MemeSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
  
    @Column(nullable = false, columnDefinition = "TEXT")
    private String caption;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "round_id")
    private Round round;

    @OneToOne(mappedBy = "memeSubmission")
    private Post post;

    private String memeURL;

    public MemeSubmission(long id, String caption, User user, Post post, String memeURL) {
        this.id = id;
        this.caption = caption;
        this.user = user;
        this.post = post;
        this.memeURL = memeURL;
    }

    public MemeSubmission() {
    }

    public MemeSubmission(long id, String caption, User user, Round round) {
        this.id = id;
        this.caption = caption;
        this.user = user;
        this.round = round;
    }

    public MemeSubmission(String caption, User user, String memeURL) {
        this.caption = caption;
        this.user = user;
        this.memeURL = memeURL;
    }

    public MemeSubmission(String caption, User user, Round round) {
        this.caption = caption;
        this.user = user;
        this.round = round;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Round getRound() {
        return round;
    }

    public void setRound(Round round) {
        this.round = round;
    }

    @JsonIgnore
    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public String getMemeURL() {
        return memeURL;
    }

    public void setMemeURL(String memeURL) {
        this.memeURL = memeURL;
    }
//    @Override
//    public String toString() {
//        return "MemeSubmission{" +
//                "id=" + id +
//                ", caption='" + caption + '\'' +
//                ", user=" + user +
//                ", round=" + round +
//                ", post=" + post +
//                '}';
//    }
}
