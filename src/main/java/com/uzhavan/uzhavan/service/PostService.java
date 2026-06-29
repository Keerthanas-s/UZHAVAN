package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Comment;
import com.uzhavan.uzhavan.entity.Post;

import java.util.List;
import java.util.Map;

public interface PostService {
    Post createPost(Post post);
    List<Map<String, Object>> getAllPosts(String userType, Long userId);
    void deletePost(Long id);
    Comment addComment(Comment comment);
    List<Comment> getCommentsByPostId(Long postId);
    boolean toggleLike(Long postId, String userType, Long userId);
}
