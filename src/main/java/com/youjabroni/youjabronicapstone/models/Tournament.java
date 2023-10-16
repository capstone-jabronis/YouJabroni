package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
//import jakarta.persistence.*;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tournaments")
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
  
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "winner_id")
    private User winner;
  
    @Column(columnDefinition = "BOOLEAN")
    private Boolean started;
  
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "tournament")
    private List<Round> rounds;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "tournament")
    private Set<User> userSet;

    @Column
    private int playerCount;


@OneToOne
private User host;

    public Tournament(User winner, List<Round> rounds, Set<User> userSet, User host, Boolean started, int   playerCount) {
        this.winner = winner;
        this.rounds = rounds;
        this.userSet = userSet;
        this.host = host;
        this.started = started;
        this.playerCount = playerCount;
    }

    public Tournament() {
    }

    public Tournament(long id, User winner, List<Round> rounds, Set<User> userSet) {
        this.id = id;
        this.winner = winner;
        this.rounds = rounds;
        this.userSet = userSet;
    }

    public int getPlayerCount() {
        return playerCount;
    }

    public void setPlayerCount(int playerCount) {
        this.playerCount = playerCount;
    }

    public Boolean getStarted() {
        return started;
    }

    public void setStarted(Boolean started) {
        this.started = started;
    }

    public User getHost() {
        return host;
    }

    public void setHost(User host) {
        this.host = host;
    }

    public Set<User> getUserSet() {
        return userSet;
    }

    public void setUserSet(Set<User> userSet) {
        this.userSet = userSet;
    }

    public Tournament(User winner, List<Round> rounds) {
        this.winner = winner;
//        this.startTime = startTime;
        this.rounds = rounds;
    }

    public List<Round> getRounds() {
        return rounds;
    }

    public void setRounds(List<Round> rounds) {
        this.rounds = rounds;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getWinner() {
        return winner;
    }

    public void setWinner(User winner) {
        this.winner = winner;
    }

//    public Timestamp getStartTime() {
//        return startTime;
//    }
//
//    public void setStartTime(Timestamp startTime) {
//        this.startTime = startTime;
//    }
}
