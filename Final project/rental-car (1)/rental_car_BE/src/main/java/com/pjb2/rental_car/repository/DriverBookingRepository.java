package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Booking;
import com.pjb2.rental_car.entity.DriverBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Driver;
import java.util.Date;
import java.util.List;

@Repository
public interface DriverBookingRepository extends JpaRepository<DriverBooking, Integer> {
    @Query(value = "select * from driver_booking where booking_id=:bookingId and driver_id=:driverId order by created_at DESC LIMIT 1",nativeQuery = true)
    DriverBooking findByBookingAndDriver(@Param("bookingId") int bookingId,@Param("driverId")  int driverId);
    @Query(value = "SELECT * FROM driver_booking  WHERE booking_id = :bookedId order by created_at DESC LIMIT 1",nativeQuery = true)
    DriverBooking getDriverBookingByBookedId(@Param("bookedId") int bookedId);
    @Query("SELECT d FROM DriverBooking d WHERE d.user.id = :driverId ORDER BY d.createdAt DESC")
    List<DriverBooking> getAllByDriverId(@Param("driverId") int driverId);


    @Query(value = """
    SELECT db.* FROM driver_booking db
        LEFT JOIN booking b ON db.booking_id = b.id
        WHERE db.driver_id = :driverId
        AND db.status NOT IN ('CANCELLED', 'REJECTED')
        AND b.status NOT IN ('CANCELLED', 'COMPLETED')
        AND ((b.start_date <= :endDate) AND (:startDate <=  b.end_date))
        ORDER BY b.start_date ASC 
        LIMIT 1
""",
            nativeQuery = true)
    DriverBooking checkNearestDriverBooking(@Param("driverId") int driverId,
                                            @Param("startDate") Date startDate,
                                            @Param("endDate") Date endDate);

}
