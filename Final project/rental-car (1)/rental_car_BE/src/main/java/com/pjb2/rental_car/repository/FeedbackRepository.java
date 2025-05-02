package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByCarId(int carId);
    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM Feedback f WHERE f.car.id = :carId")
    double getAverageRatingByCarId(Integer carId);

    @Query(value = "SELECT f.* FROM feedback f\n" +
            "JOIN car c ON f.car_id = c.id\n" +
            "JOIN user u ON c.user_id = u.id \n" +
            "WHERE u.id = :user_id",nativeQuery = true)
    Page<Feedback> getAllFeedbackByUserId(@Param("user_id") int user_id, Pageable pageable);
    //find feedback for all car by one car owner and paging
    @Query(value = "SELECT f.* FROM feedback f JOIN car c ON f.car_id = c.id " +
            "JOIN user u ON c.user_id = u.id " +
            "WHERE u.id =:carOwnerId AND (:starRating = 0 OR f.rating = :starRating OR f.rating = :starRating + 0.5)",
            countQuery = "SELECT COUNT(*) FROM feedback f JOIN car c ON f.car_id = c.id " +
                    "JOIN user u ON c.user_id = u.id " +
                    "WHERE u.id =:carOwnerId AND (:starRating = 0 OR f.rating = :starRating OR f.rating = :starRating + 0.5)",
            nativeQuery = true)
    Page<Feedback> getAllFeedbackByCarOwner(@Param("carOwnerId") int carOwnerId,
                                            @Param("starRating") int starRating,
                                            Pageable pageable);
    @Query(value = "SELECT f.* FROM feedback f JOIN car c ON f.car_id = c.id\n" +
            "JOIN user u ON c.user_id = u.id\n" +
            "WHERE u.id =:carOwnerId AND (:starRating = 0 OR f.rating = :starRating OR f.rating = :starRating + 0.5)",nativeQuery = true)
    List<Feedback> getAllFeedbackByCarOwner(@Param("carOwnerId") int carOwnerId,@Param("starRating") int starRating);

    @Query("SELECT COUNT(f.id) > 0 FROM Feedback f WHERE f.booking.id = :bookingId")
    boolean isFeedback(@Param("bookingId") int bookingId);

    Page<Feedback> findByCarIdIn(List<Integer> carIds, Pageable pageable);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.car.user.id = :carOwnerId")
    int countFeedbackByCarOwnerId(@Param("carOwnerId") int carOwnerId);

    @Query("SELECT AVG(f.rating) " +
            "FROM Feedback f " +
            "WHERE f.car.user.id = :ownerId")
    Double getAverageRatingByOwnerId(@Param("ownerId") int ownerId);
    @Query(value = "select * from feedback where car_id =:carId",nativeQuery = true)
    Page<Feedback> findFeedbackByCarId(@Param("carId") int carId, Pageable pageable);

}
