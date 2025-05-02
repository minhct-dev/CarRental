package com.pjb2.rental_car.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public class AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @CreationTimestamp // Hibernate tự động gán khi entity được tạo
    private LocalDateTime createdAt;

    @UpdateTimestamp // Hibernate tự động cập nhật mỗi khi entity thay đổi
    private LocalDateTime updatedAt;
}
