package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Message;

import java.util.List;

public interface MessageService {
    Message sendMessage(Message message);
    List<Message> getInbox(String receiverType, Long receiverId);
    List<Message> getSent(String senderType, Long senderId);
    List<Message> getConversation(String type1, Long id1, String type2, Long id2);
    Message markAsRead(Long id);
    long getUnreadCount(String receiverType, Long receiverId);
    void deleteMessage(Long id);
}