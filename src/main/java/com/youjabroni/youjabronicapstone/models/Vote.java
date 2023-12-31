package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "votes")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @OneToOne
    @JsonIgnore
    private User user;
    @OneToOne
    private MemeSubmission memeSubmission;

    public Vote() {
    }

    public Vote(User user, MemeSubmission memeSubmission) {
        this.user = user;
        this.memeSubmission = memeSubmission;
    }

    public Vote(long id, User user, MemeSubmission memeSubmission) {
        this.id = id;
        this.user = user;
        this.memeSubmission = memeSubmission;
    }

    public User getUser() {
        return user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
}
