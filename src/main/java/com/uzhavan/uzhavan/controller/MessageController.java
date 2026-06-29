package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Message;
import com.uzhavan.uzhavan.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return new ResponseEntity<>(messageService.sendMessage(message), HttpStatus.CREATED);
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<Message>> getInbox(@RequestParam String receiverType,
                                                    @RequestParam Long receiverId) {
        return ResponseEntity.ok(messageService.getInbox(receiverType, receiverId));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Message>> getSent(@RequestParam String senderType,
                                                   @RequestParam Long senderId) {
        return ResponseEntity.ok(messageService.getSent(senderType, senderId));
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(@RequestParam String type1, @RequestParam Long id1,
                                                           @RequestParam String type2, @RequestParam Long id2) {
        return ResponseEntity.ok(messageService.getConversation(type1, id1, type2, id2));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Message> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.markAsRead(id));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(@RequestParam String receiverType, @RequestParam Long receiverId) {
        return ResponseEntity.ok(messageService.getUnreadCount(receiverType, receiverId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}