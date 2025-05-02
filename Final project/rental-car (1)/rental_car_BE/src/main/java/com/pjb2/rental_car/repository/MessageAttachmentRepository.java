package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.MessageAttachment;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageAttachmentRepository  extends JpaRepository<MessageAttachment, Integer> {
    List<MessageAttachment> findByMessageId(int messageId);

}
