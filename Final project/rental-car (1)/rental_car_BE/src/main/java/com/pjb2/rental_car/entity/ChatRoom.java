package com.pjb2.rental_car.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chat_room")
public class ChatRoom extends AbstractEntity {
    private String chatId;
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;
    public static String generateChatId(int senderId, int recipientId) {
        int user1 = Math.min(senderId, recipientId);
        int user2 = Math.max(senderId, recipientId);
        return user1 + "_" + user2;
    }
}

