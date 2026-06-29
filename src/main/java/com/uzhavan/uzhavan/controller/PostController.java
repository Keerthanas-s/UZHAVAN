package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Comment;
import com.uzhavan.uzhavan.entity.Post;
import com.uzhavan.uzhavan.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return new ResponseEntity<>(postService.createPost(post), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(postService.getAllPosts(userType, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long id,
            @RequestBody Comment comment) {
        comment.setPostId(id);
        return new ResponseEntity<>(postService.addComment(comment), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getCommentsByPostId(id));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Boolean>> toggleLike(
            @PathVariable Long id,
            @RequestParam String userType,
            @RequestParam Long userId) {
        boolean liked = postService.toggleLike(id, userType, userId);
        return ResponseEntity.ok(Map.of("liked", liked));
    }
}
