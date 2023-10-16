package com.youjabroni.youjabronicapstone.models;

public class Message {
    public enum MessageType {
        DATA, START, JOIN, LEAVE, VOTE, RESULT, FINISH
    }
    private MessageType messageType;
    private String user;
    private String text;
    private String memeURL;

    public Message(){}

    public Message(String user, String text, String memeURL) {
        this.user = user;
        this.text = text;
        this.memeURL = memeURL;
    }

    public Message(MessageType messageType, String user, String text, String memeURL) {
        this.messageType = messageType;
        this.user = user;
        this.text = text;
        this.memeURL = memeURL;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public String getMemeURL() {
        return memeURL;
    }

    public void setMemeURL(String memeURL) {
        this.memeURL = memeURL;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
