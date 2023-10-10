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
  
//    @Column(nullable = false, columnDefinition = "DATETIME")
//    private Timestamp startTime;
  
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "tournament")
    private List<Round> rounds;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "tournament")
    private Set<User> userSet;

@OneToOne
private User host;

    public Tournament(User winner, List<Round> rounds, Set<User> userSet, User host) {
        this.winner = winner;
//        this.startTime = startTime;
        this.rounds = rounds;
        this.userSet = userSet;
        this.host = host;
    }

    public Tournament() {
    }

    public Tournament(long id, User winner, List<Round> rounds, Set<User> userSet) {
        this.id = id;
        this.winner = winner;
//        this.startTime = startTime;
        this.rounds = rounds;
        this.userSet = userSet;
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
