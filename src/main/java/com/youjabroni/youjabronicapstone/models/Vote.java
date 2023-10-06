package com.youjabroni.youjabronicapstone.models;

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
