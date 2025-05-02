package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.CarBrand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarBrandRepository extends JpaRepository<CarBrand, Integer> {
}
