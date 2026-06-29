package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Comment;
import com.uzhavan.uzhavan.entity.Post;
import com.uzhavan.uzhavan.entity.PostLike;
import com.uzhavan.uzhavan.repository.CommentRepository;
import com.uzhavan.uzhavan.repository.PostLikeRepository;
import com.uzhavan.uzhavan.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Override
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public List<Map<String, Object>> getAllPosts(String userType, Long userId) {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Post p : posts) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("authorName", p.getAuthorName());
            map.put("farmerId", p.getFarmerId());
            map.put("content", p.getContent());
            map.put("imageUrl", p.getImageUrl());
            map.put("price", p.getPrice());
            map.put("stock", p.getStock());
            map.put("createdAt", p.getCreatedAt());

            // Compile dynamic likes and comments counts
            long likesCount = postLikeRepository.countByPostId(p.getId());
            long commentsCount = commentRepository.findByPostIdOrderByCreatedAtAsc(p.getId()).size();

            boolean isLiked = false;
            if (userType != null && userId != null) {
                isLiked = postLikeRepository.existsByPostIdAndUserTypeAndUserId(p.getId(), userType, userId);
            }

            map.put("likesCount", likesCount);
            map.put("commentsCount", commentsCount);
            map.put("liked", isLiked);

            result.add(map);
        }

        return result;
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    @Override
    public boolean toggleLike(Long postId, String userType, Long userId) {
        Optional<PostLike> existing = postLikeRepository.findByPostIdAndUserTypeAndUserId(postId, userType, userId);
        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            return false; // unliked
        } else {
            postLikeRepository.save(new PostLike(postId, userType, userId));
            return true; // liked
        }
    }
}
