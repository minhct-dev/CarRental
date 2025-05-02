package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.ChatMessage;
import com.pjb2.rental_car.exception.ApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findByChatId(String chatId);

    ChatMessage findById(int messageId);

    List<ChatMessage> findByIdIn(List<Integer> ids);
    @Query(value = "Select * from chat_message where recipient_id=:recipientId and chat_id =:chatId and status = 'UNSEEN'",nativeQuery = true)
    List<ChatMessage> findUnseenMessagesInChatBox(@Param("recipientId") int recipientId , @Param("chatId") String chatId);

    @Query(value = "SELECT * FROM chat_message WHERE chat_id = :chatId ORDER BY created_at DESC LIMIT 1", nativeQuery = true)
    ChatMessage findLatestMessageByChatId(@Param("chatId") String chatId);
    @Query(value = "SELECT * FROM chat_message WHERE chat_id = :chatId",nativeQuery = true)
    Page<ChatMessage> findHistoryMessageByChatId(@Param("chatId") String chatId, Pageable pageable);

    @Query(value = "Select * from chat_message where recipient_id=:recipientId and status = 'UNSEEN'",nativeQuery = true)
    List<ChatMessage> findUnseenMessages(@Param("recipientId") int recipientId);
}
