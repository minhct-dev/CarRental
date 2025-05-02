package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.UserImageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_images")
public class UserImages extends AbstractEntity{
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private UserImageType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "user_draft_id")
    private UserDraft userDraft;
}
