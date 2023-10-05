package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "rounds")
public class Round {
    //    Round bean: must have(long id, int roundNumber [CAN BE ENUM team discussion if want], Tournament tournament, external API reference, List<MemeSubmissions> memesubmissions)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private int round_num;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "tournament_id")
    @JsonBackReference
    private Tournament tournament;
    @Column(nullable = false)
    private String meme_pic;
    @JsonIgnore
    @OneToMany(mappedBy = "round")
    @JsonManagedReference
    private List<MemeSubmission> memeSubmissions;

    public Round() {
    }

    public Round(long id, int round_num, Tournament tournament, String meme_pic) {
        this.id = id;
        this.round_num = round_num;
        this.tournament = tournament;
        this.meme_pic = meme_pic;
    }

    public Round(int round_num, Tournament tournament, String meme_pic) {
        this.round_num = round_num;
        this.tournament = tournament;
        this.meme_pic = meme_pic;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getRound_num() {
        return round_num;
    }

    public void setRound_num(int round_num) {
        this.round_num = round_num;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public String getMeme_pic() {
        return meme_pic;
    }

    public void setMeme_pic(String meme_pic) {
        this.meme_pic = meme_pic;
    }

    public List<MemeSubmission> getMemeSubmissions() {
        return memeSubmissions;
    }

    public void setMemeSubmissions(List<MemeSubmission> memeSubmissions) {
        this.memeSubmissions = memeSubmissions;
    }
}
