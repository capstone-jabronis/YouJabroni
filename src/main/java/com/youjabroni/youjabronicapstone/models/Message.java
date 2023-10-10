package com.youjabroni.youjabronicapstone.models;

public class Message {
    public enum MessageType {
        DATA, JOIN, LEAVE
    }
    private MessageType messageType;
    private String user;
    private String text;

    public Message(){}

    public Message(String user, String text) {
        this.user = user;
        this.text = text;
    }

    public Message(MessageType messageType, String user, String text) {
        this.messageType = messageType;
        this.user = user;
        this.text = text;
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



    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
