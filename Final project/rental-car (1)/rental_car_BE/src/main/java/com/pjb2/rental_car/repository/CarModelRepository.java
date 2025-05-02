package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarModelRepository extends JpaRepository<CarModel, Integer> {
    @Query(value = "select * from car_model where id= :model_id",nativeQuery = true)
    CarModel findById(@Param("model_id")int id);

    List<CarModel> findByIdIn(List<Integer> ids);
}
