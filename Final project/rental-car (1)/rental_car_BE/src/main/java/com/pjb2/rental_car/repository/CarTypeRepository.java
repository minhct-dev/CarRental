package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.CarType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarTypeRepository extends JpaRepository<CarType,Integer> {
}
