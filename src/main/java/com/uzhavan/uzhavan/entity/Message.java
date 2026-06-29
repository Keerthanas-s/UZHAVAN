package com.uzhavan.uzhavan.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderType; // FARMER or CUSTOMER

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private String receiverType; // FARMER or CUSTOMER

    @Column(nullable = false)
    private Long receiverId;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime sentAt;

    public Message() {}

    public Message(Long id, String senderType, Long senderId, String receiverType, Long receiverId,
                    String content, boolean isRead) {
        this.id = id;
        this.senderType = senderType;
        this.senderId = senderId;
        this.receiverType = receiverType;
        this.receiverId = receiverId;
        this.content = content;
        this.isRead = isRead;
    }

    @PrePersist
    protected void onCreate() { this.sentAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getReceiverType() { return receiverType; }
    public void setReceiverType(String receiverType) { this.receiverType = receiverType; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}