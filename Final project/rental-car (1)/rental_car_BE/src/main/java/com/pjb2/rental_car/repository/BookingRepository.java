package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Booking;
import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.DriverBooking;
import com.pjb2.rental_car.util.common.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    @Query(value = "SELECT * FROM booking WHERE car_id = :carId AND created_at < NOW()", nativeQuery = true)
    List<Booking> findBookingByCarId(@Param("carId") int carId);

    List<Booking> findBookingsByUserId(@Param("userId") int userId);

    @Query(value = "Select * FROM booking where car_id = :carId AND user_id = :userId AND status != 'CANCELLED' AND status != 'COMPLETED'",nativeQuery = true)
    List<Booking> checkUserBookingCar(@Param("userId")int userId,@Param("carId") int carId);

    @Query(value = "select * from booking where user_id= :user_id",nativeQuery = true)
    Page<Booking> findBookingsByUserId(@Param("user_id") int user_id, Pageable pageable);

    @Query(value = "SELECT * FROM booking WHERE car_owner_id = :carOwner_id", nativeQuery = true)
    Page<Booking> findBookingsByCarOnwer(@Param("carOwner_id") int carOwner_id, Pageable pageable);

    Optional<Booking> findByCarIdAndStatus(int carId, BookingStatus status);

    @Query(value = "SELECT * FROM booking " +
            "WHERE car_id = :carId " +
            "AND status NOT IN ('CANCELLED', 'COMPLETED') " +
            "AND (start_date <= :endDate AND :startDate <= end_date) " +
            "ORDER BY start_date ASC " +
            "LIMIT 1",
            nativeQuery = true)
    Booking checkNearestBooking(@Param("carId") int carId,
                                @Param("startDate") Date startDate,
                                @Param("endDate") Date endDate);


    Optional<Booking> findByIdAndStatus(Integer id, BookingStatus status);

    List<Booking> findByCarId(int carId);

    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND b.status = 'COMPLETED'")
    List<Booking> findCompletedBookingsByCarId(@Param("carId") int carId);

    @Query(value = "SELECT * FROM booking WHERE driver_id = :driverId ", nativeQuery = true)
    List<Booking> findBookingByDriverId(@Param("driverId") int driverId);


    @Query("SELECT COUNT(b) FROM Booking b " +
            "JOIN b.car c " +
            "WHERE c.user.id = :ownerId AND b.status = :status")
    Long countBookingsByOwnerAndStatus(@Param("ownerId") int ownerId, @Param("status") BookingStatus status);

    @Query(value = "Select * From booking where car_owner_id = :carOwnerId",nativeQuery = true)
    List<Booking> findBookingByCarOwnerId(@Param("carOwnerId") int carOwnerId);
    @Query(value = "select * from booking where status = 'CANCELLED' or status ='COMPLETED'",nativeQuery = true)
    List<Booking> getAllDoneBookings();
}
