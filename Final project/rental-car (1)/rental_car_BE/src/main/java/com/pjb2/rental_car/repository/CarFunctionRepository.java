package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.CarDraft;
import com.pjb2.rental_car.entity.CarFunction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CarFunctionRepository extends JpaRepository<CarFunction,Integer> {
    @Modifying
    @Transactional
    @Query(value = "UPDATE car_function \n" +
            "SET car_id = :carId \n" +
            "WHERE car_draft_id= :draftId",nativeQuery = true)
    void setCarFunction(@Param("draftId") int draftId , @Param("carId") int carId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE car_function \n" +
            "SET car_id = null\n" +
            "WHERE car_id= :carId",nativeQuery = true)
    void deleteCarFunction(@Param("carId") int carId);

    List<CarFunction> findByCarDraft(CarDraft carDraft);

    List<CarFunction> findByCar(Car car);
}
