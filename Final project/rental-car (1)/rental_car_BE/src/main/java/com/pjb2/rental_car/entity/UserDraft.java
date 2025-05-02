package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.UserDraftStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_draft")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDraft extends AbstractEntity {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String nationalId;
    private String phone;
    private String addressDetail;
    private Date dob;
    // thong tin lái xe
    private double price;
    private double lateFee;
    private int driverExp;
    @ManyToOne
    @JoinColumn(name = "province_code")
    private Province province;
    @ManyToOne
    @JoinColumn(name = "district_code")
    private District district;
    @ManyToOne
    @JoinColumn(name = "ward_code")
    private Ward ward;
    @OneToMany(mappedBy = "userDraft")
    private List<UserImages> userImages;
    private String description;
    private boolean isDeleted;
    private String rejectMessage;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserDraftStatus status;

}
