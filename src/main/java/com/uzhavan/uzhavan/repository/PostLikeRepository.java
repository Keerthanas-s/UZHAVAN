package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    List<PostLike> findByPostId(Long postId);
    long countByPostId(Long postId);
    Optional<PostLike> findByPostIdAndUserTypeAndUserId(Long postId, String userType, Long userId);
    boolean existsByPostIdAndUserTypeAndUserId(Long postId, String userType, Long userId);
}
