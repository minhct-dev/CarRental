package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class User extends AbstractEntity {
    private String name;
    private String nationalId;
    private String email;
    private String password;
    private String phone;
    private String addressDetail;
    private Date dob;
    private String refreshToken;
    private String activeToken;
    private String forgotPasswordToken;

    // thong tin lái xe
    private double price;
    private double lateFee;
    private int driverExp;
    //end

    @Enumerated(EnumType.STRING)
    private UserStatus status;
    @OneToMany(mappedBy = "user")
    private List<Car> cars;
    @OneToMany(mappedBy = "user")
    private List<Feedback> feedbacks;
    @ManyToOne
    @JoinColumn(name = "province_code")
    private Province province;
    @ManyToOne
    @JoinColumn(name = "district_code")
    private District district;
    @ManyToOne
    @JoinColumn(name = "ward_code")
    private Ward ward;
    @OneToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
    @OneToMany(mappedBy = "user")
    private List<UserImages> userImages;

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "driver")
    private List<Booking> bookingsDriver;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;
    @OneToMany(mappedBy = "carOwner")
    private List<Booking> carOwnerBooking;

    private String description;

    private boolean isBan;

    private Integer banDuration = 0;
    private String banReason;
    private LocalDateTime banStartTime;

    @OneToMany(mappedBy = "user")
    private List<Voucher> vouchers;

    @OneToMany(mappedBy = "sender")
    private List<ChatRoom> chatRooms;

    @OneToMany(mappedBy = "sender")
    private List<ChatMessage> sentMessages;

    @OneToMany(mappedBy = "recipient")
    private List<ChatMessage> receivedMessages;

}
