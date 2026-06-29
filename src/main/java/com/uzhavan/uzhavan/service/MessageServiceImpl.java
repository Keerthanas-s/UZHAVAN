package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Message;
import com.uzhavan.uzhavan.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Message sendMessage(Message message) {
        message.setRead(false);
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getInbox(String receiverType, Long receiverId) {
        return messageRepository.findByReceiverTypeAndReceiverId(receiverType, receiverId);
    }

    @Override
    public List<Message> getSent(String senderType, Long senderId) {
        return messageRepository.findBySenderTypeAndSenderId(senderType, senderId);
    }

    @Override
    public List<Message> getConversation(String type1, Long id1, String type2, Long id2) {
        List<Message> oneToTwo = messageRepository
                .findBySenderTypeAndSenderIdAndReceiverTypeAndReceiverIdOrderBySentAtAsc(type1, id1, type2, id2);
        List<Message> twoToOne = messageRepository
                .findBySenderTypeAndSenderIdAndReceiverTypeAndReceiverIdOrderBySentAtAsc(type2, id2, type1, id1);

        return Stream.concat(oneToTwo.stream(), twoToOne.stream())
                .sorted((m1, m2) -> m1.getSentAt().compareTo(m2.getSentAt()))
                .collect(Collectors.toList());
    }

    @Override
    public Message markAsRead(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        return messageRepository.save(message);
    }

    @Override
    public long getUnreadCount(String receiverType, Long receiverId) {
        return messageRepository.findByReceiverTypeAndReceiverIdAndIsReadFalse(receiverType, receiverId).size();
    }

    @Override
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}