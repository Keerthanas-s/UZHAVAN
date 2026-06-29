package com.uzhavan.uzhavan.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "story_like")
public class StoryLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storyId;

    @Column(nullable = false)
    private String userType; // CUSTOMER, FARMER, ADMIN

    @Column(nullable = false)
    private Long userId;

    public StoryLike() {}

    public StoryLike(Long storyId, String userType, Long userId) {
        this.storyId = storyId;
        this.userType = userType;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStoryId() { return storyId; }
    public void setStoryId(Long storyId) { this.storyId = storyId; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
