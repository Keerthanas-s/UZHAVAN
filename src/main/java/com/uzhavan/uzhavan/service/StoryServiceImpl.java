package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Story;
import com.uzhavan.uzhavan.entity.StoryLike;
import com.uzhavan.uzhavan.repository.StoryLikeRepository;
import com.uzhavan.uzhavan.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StoryServiceImpl implements StoryService {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private StoryLikeRepository storyLikeRepository;

    @Override
    public Story createStory(Story story) {
        return storyRepository.save(story);
    }

    @Override
    public List<Map<String, Object>> getAllStories(String userType, Long userId) {
        List<Story> stories = storyRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Story s : stories) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("farmerId", s.getFarmerId());
            map.put("authorName", s.getAuthorName());
            map.put("imageUrl", s.getImageUrl());
            map.put("caption", s.getCaption());
            map.put("createdAt", s.getCreatedAt());

            long likesCount = storyLikeRepository.countByStoryId(s.getId());
            boolean liked = false;
            if (userType != null && userId != null) {
                liked = storyLikeRepository.existsByStoryIdAndUserTypeAndUserId(s.getId(), userType, userId);
            }

            map.put("likesCount", likesCount);
            map.put("liked", liked);

            result.add(map);
        }
        return result;
    }

    @Override
    public void deleteStory(Long id) {
        storyRepository.deleteById(id);
    }

    @Override
    public boolean toggleLike(Long storyId, String userType, Long userId) {
        Optional<StoryLike> existing = storyLikeRepository.findByStoryIdAndUserTypeAndUserId(storyId, userType, userId);
        if (existing.isPresent()) {
            storyLikeRepository.delete(existing.get());
            return false; // unliked
        } else {
            storyLikeRepository.save(new StoryLike(storyId, userType, userId));
            return true; // liked
        }
    }
}
