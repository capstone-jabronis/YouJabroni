package com.youjabroni.youjabronicapstone.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    private String ProfileURL;
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "user")
    private List<MemeSubmission> memeSubmissions;

    public User() {
    }
    public User(User copy) {
        id = copy.id; // This line is SUPER important! Many things won't work if it's absent
        username = copy.username;
        email = copy.email;
        password = copy.password;
        ProfileURL = copy.ProfileURL;
        memeSubmissions = copy.memeSubmissions;
    }

    public User(long id, String username, String email, String password, String profileURL, List<MemeSubmission> memeSubmissions) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        ProfileURL = profileURL;
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

    public long getId() {
        return id;
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

    public List<MemeSubmission> getMemeSubmissions() {
        return memeSubmissions;
    }

    public void setMemeSubmissions(List<MemeSubmission> memeSubmissions) {
        this.memeSubmissions = memeSubmissions;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", profileURL='" + ProfileURL + '\'' +
                ", memeSubmissions=" + memeSubmissions +
                '}';
    }
}
