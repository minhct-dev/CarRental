package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.dto.response.UserRoleResponse;
import com.pjb2.rental_car.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    @Query("SELECT new com.pjb2.rental_car.dto.response.UserRoleResponse(r.id, r.name) FROM Role r")
    List<UserRoleResponse> findAllRoleResponses();
}
