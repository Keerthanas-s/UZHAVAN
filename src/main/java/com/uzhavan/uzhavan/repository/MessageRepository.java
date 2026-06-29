package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderTypeAndSenderId(String senderType, Long senderId);

    List<Message> findByReceiverTypeAndReceiverId(String receiverType, Long receiverId);

    List<Message> findByReceiverTypeAndReceiverIdAndIsReadFalse(String receiverType, Long receiverId);

    // Conversation between two specific parties (either direction)
    List<Message> findBySenderTypeAndSenderIdAndReceiverTypeAndReceiverIdOrderBySentAtAsc(
            String senderType, Long senderId, String receiverType, Long receiverId);
}