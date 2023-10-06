package com.youjabroni.youjabronicapstone.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
//import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String profileURL;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "user")
    @JsonManagedReference
    private List<MemeSubmission> memeSubmissions;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "user")
    @JsonManagedReference
    private List<Post> posts;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "tournament_id")
    @JsonBackReference
    private Tournament tournament;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "user")
    @JsonManagedReference
    private List<Like> likes;
  
//    @JsonIgnore
//    @OneToMany(mappedBy = "winner")
//    private List<Tournament> tournamentsWon;

    public User(long id, String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions, Tournament tournament, List<Tournament> tournamentsWon) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileURL = profileURL;
        this.memeSubmissions = memeSubmissions;
        this.tournament = tournament;
        this.tournamentsWon = tournamentsWon;
    }

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "winner")
    @JsonManagedReference
    private List<Tournament> tournamentsWon;

    public User(String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions, Tournament tournament) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileURL = profileURL;
        this.memeSubmissions = memeSubmissions;
        this.tournament = tournament;
    }

    public User(long id, String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions, Tournament tournament) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileURL = profileURL;
        this.memeSubmissions = memeSubmissions;
        this.tournament = tournament;
    }

    public User() {
    }
    public User(User copy) {
        id = copy.id; // This line is SUPER important! Many things won't work if it's absent
        username = copy.username;
        email = copy.email;
        password = copy.password;
        profileURL = copy.profileURL;
        memeSubmissions = copy.memeSubmissions;
        tournament = copy.tournament;
    }

    public User(long id, String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileURL = profileURL;
        this.memeSubmissions = memeSubmissions;
    }

    public User(String username, String email, String password, List<MemeSubmission> memeSubmissions) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.memeSubmissions = memeSubmissions;
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public User(long id, String username, String email, String password, List<MemeSubmission> memeSubmissions) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.memeSubmissions = memeSubmissions;
    }

    public User(String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions, List<Post> posts, Tournament tournament) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileURL = profileURL;
        this.memeSubmissions = memeSubmissions;
        this.posts = posts;
        this.tournament = tournament;
    }

    public long getId() {
        return id;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfileURL() {
        return profileURL;
    }

    public void setProfileURL(String profileURL) {
        this.profileURL = profileURL;
    }

    public List<MemeSubmission> getMemeSubmissions() {
        return memeSubmissions;
    }

    public void setMemeSubmissions(List<MemeSubmission> memeSubmissions) {
        this.memeSubmissions = memeSubmissions;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public User(long id, String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions, List<Post> posts, Tournament tournament, List<Like> likes, List<Tournament> tournamentsWon) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileURL = profileURL;
        this.memeSubmissions = memeSubmissions;
        this.posts = posts;
        this.tournament = tournament;
        this.likes = likes;
        this.tournamentsWon = tournamentsWon;
    }

//    @Override
//    public String toString() {
//        return "User{" +
//                "id=" + id +
//                ", username='" + username + '\'' +
//                ", email='" + email + '\'' +
//                ", password='" + password + '\'' +
//                ", profileURL='" + profileURL + '\'' +
//                ", memeSubmissions=" + memeSubmissions +
//                '}';
//    }
}
