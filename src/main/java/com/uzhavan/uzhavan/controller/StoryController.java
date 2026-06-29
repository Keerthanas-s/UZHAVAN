package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Story;
import com.uzhavan.uzhavan.service.StoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @PostMapping
    public ResponseEntity<Story> createStory(@RequestBody Story story) {
        return new ResponseEntity<>(storyService.createStory(story), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllStories(
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(storyService.getAllStories(userType, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Boolean>> toggleLike(
            @PathVariable Long id,
            @RequestParam String userType,
            @RequestParam Long userId) {
        boolean liked = storyService.toggleLike(id, userType, userId);
        return ResponseEntity.ok(Map.of("liked", liked));
    }
}
