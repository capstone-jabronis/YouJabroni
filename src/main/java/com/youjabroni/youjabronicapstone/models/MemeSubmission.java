package com.youjabroni.youjabronicapstone.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "meme_submission")
public class MemeSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    //For websocket messaging. Creating a meme submission as a message and sending it to/from the server client/////////////
    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    private MessageType messageType;

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }
    //websocket stuff end////////////////////////////////////////

    @Column(nullable = false, columnDefinition = "TEXT")
    private String caption;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "round_id")
    private Round round;

    public MemeSubmission() {
    }

    public MemeSubmission(long id, String caption, User user, Round round) {
        this.id = id;
        this.caption = caption;
        this.user = user;
        this.round = round;
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
}
