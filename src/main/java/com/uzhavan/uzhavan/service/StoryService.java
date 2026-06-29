package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Story;

import java.util.List;
import java.util.Map;

public interface StoryService {
    Story createStory(Story story);
    List<Map<String, Object>> getAllStories(String userType, Long userId);
    void deleteStory(Long id);
    boolean toggleLike(Long storyId, String userType, Long userId);
}
