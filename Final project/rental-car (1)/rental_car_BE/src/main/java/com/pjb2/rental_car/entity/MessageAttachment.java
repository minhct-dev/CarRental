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
@Table(name = "message_attachment")
public class MessageAttachment extends AbstractEntity {
    private String attachmentUrl;
    @ManyToOne
    @JoinColumn(name="message_id")
    private ChatMessage message;

}
