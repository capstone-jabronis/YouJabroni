package com.youjabroni.youjabronicapstone.models;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "tournaments")
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @OneToOne
    private User winner;
    @Column(nullable = false, columnDefinition = "DATETIME")
    private Timestamp startTime;
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "tournament")
    private List<Round> rounds;

    public Tournament() {
    }

    public Tournament(long id, User winner, Timestamp startTime, List<Round> rounds) {
        this.id = id;
        this.winner = winner;
        this.startTime = startTime;
        this.rounds = rounds;
    }

    public Tournament(User winner, Timestamp startTime, List<Round> rounds) {
        this.winner = winner;
        this.startTime = startTime;
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

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }
}
