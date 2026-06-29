package com.uzhavan.uzhavan.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "post_like")
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long postId;

    @Column(nullable = false)
    private String userType; // CUSTOMER, FARMER, ADMIN

    @Column(nullable = false)
    private Long userId;

    public PostLike() {}

    public PostLike(Long postId, String userType, Long userId) {
        this.postId = postId;
        this.userType = userType;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
