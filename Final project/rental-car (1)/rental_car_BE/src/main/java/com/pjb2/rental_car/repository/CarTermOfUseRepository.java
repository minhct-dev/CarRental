package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.CarDraft;
import com.pjb2.rental_car.entity.CarTermOfUse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CarTermOfUseRepository extends JpaRepository<CarTermOfUse, Integer> {
    @Modifying
    @Transactional
    @Query(value = "UPDATE car_term_of_use \n" +
            "SET car_id = :carId \n" +
            "WHERE car_draft_id= :draftId",nativeQuery = true)
    void setCarTermOfUse(@Param("draftId") int draftId ,@Param("carId") int carId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE car_term_of_use \n" +
            "SET car_id = null \n" +
            "WHERE car_id = :carId",nativeQuery = true)
    void deleteCarTermOfUse(@Param("carId") int carId);

    List<CarTermOfUse> findByCarDraft(CarDraft carDraft);
    List<CarTermOfUse> findByCar(Car car);
    @Query(value = "SELECT * FROM car_term_of_use where car_draft_id=:draftId AND term_type='LATE_FEE'",nativeQuery = true)
    CarTermOfUse findLateFeeByCarDraft(@Param("draftId") int draftId);
    @Query(value = "SELECT * FROM car_term_of_use where car_id=:carId AND term_type='LATE_FEE'",nativeQuery = true)
    CarTermOfUse findLateFeeByCar(@Param("carId") int carId);
}
