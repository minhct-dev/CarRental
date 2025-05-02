package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.DriverBookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Data
@Table(name = "driver_booking")
public class DriverBooking extends AbstractEntity {
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DriverBookingStatus status;
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User user;

}
