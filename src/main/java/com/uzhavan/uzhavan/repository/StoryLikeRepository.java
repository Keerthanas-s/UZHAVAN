package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.StoryLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoryLikeRepository extends JpaRepository<StoryLike, Long> {
    long countByStoryId(Long storyId);
    Optional<StoryLike> findByStoryIdAndUserTypeAndUserId(Long storyId, String userType, Long userId);
    boolean existsByStoryIdAndUserTypeAndUserId(Long storyId, String userType, Long userId);
}
