package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.CarFunctionInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CarFunctionInfoRepository extends JpaRepository<CarFunctionInfo, Integer> {
    @Query(value = "select * from car_function_info where id= :Id",nativeQuery = true)
    CarFunctionInfo GetByFuncId(@Param("Id") int Id);
}
