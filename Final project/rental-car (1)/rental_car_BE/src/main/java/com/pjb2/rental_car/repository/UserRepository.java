package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.dto.response.DriverListReponse;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.util.common.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.ValueExpressionQueryRewriter;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String Email);

    boolean existsByEmail(String Email);

    boolean existsByPhone(String Phone);

    boolean existsByNationalId(String nationalId);

    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN u.roles r " +
            "WHERE r.id = 1 " +
            "AND u.status = 'ACTIVE' " +
            "AND (" +
            "(:provinceCode IS NOT NULL OR :districtCode IS NOT NULL OR :wardCode IS NOT NULL)" +
            ") " +
            "AND (:provinceCode IS NULL OR u.province.code = :provinceCode) " +
            "AND (:districtCode IS NULL OR u.district.code = :districtCode) " +
            "AND (:wardCode IS NULL OR u.ward.code = :wardCode)")
    List<User> searchDrivers(
            @Param("provinceCode") String provinceCode,
            @Param("districtCode") String districtCode,
            @Param("wardCode") String wardCode
    );



    @Query(value = "SELECT u.*, r.id as role_id, r.name as role_name from user u\n" +
            "            JOIN user_role ur ON u.id = ur.user_id \n" +
            "            JOIN role r ON ur.role_id = r.id \n" +
            "            WHERE r.`name` = 'driver' AND status like 'ACTIVE' AND ban_duration = 0\n" +
            "            AND (:provinceCode IS NULL OR province_code = :provinceCode)\n" +
            "\t\t\t\t\t\t\tAND (:districtCode IS NULL OR district_code = :districtCode) \n" +
            "\t\t\t\t\t\t\tAND (:wardCode IS NULL OR ward_code = :wardCode)",
            nativeQuery = true)
    List<User> searchByAddressCode(@Param("provinceCode") String provinceCode,
                                   @Param("districtCode") String districtCode,
                                   @Param("wardCode") String wardCode);
    @Query(value = "select * from user where id=:driverId limit 1", nativeQuery = true)
    User findUserByDriverId(@Param("driverId") int driverId);


    @Query("""
    SELECT u FROM User u 
    WHERE (:name IS NULL OR u.name LIKE %:name%) 
      AND (:email IS NULL OR u.email LIKE %:email%) 
      AND (:roleId IS NULL OR EXISTS (
            SELECT r FROM u.roles r WHERE r.id = :roleId
      ))
      AND (:status IS NULL OR u.status = :status)
      AND (:isBan IS NULL OR u.isBan = :isBan)
""")
    Page<User> findUsers(
            @Param("name") String name,
            @Param("email") String email,
            @Param("roleId") Integer roleId,
            @Param("status") UserStatus status,
            @Param("isBan") Boolean isBan,
            Pageable pageable
    );
    @Query(value = """
    select u.* from user u 
        join user_role ur on u.id = ur.user_id 
        join role r on r.id = ur.role_id
    where r.name != 'admin'
""",nativeQuery = true)
    List<User> getAllUsers();

    @Query(value = """
    select u.* from user u 
        join user_role ur on u.id = ur.user_id 
        join role r on r.id = ur.role_id
    where r.name = :role
""",nativeQuery = true)
    List<User> getUsersByRole(@Param("role") String role);

    User findUserById(int id);
    List<User> findAllByIsBanTrue();

}
