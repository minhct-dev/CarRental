package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.entity.UserImages;
import com.pjb2.rental_car.util.common.UserImageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserImagesRepository extends JpaRepository<UserImages, Integer> {
    @Query(value = "SELECT * FROM user_images WHERE user_id = :userId AND type = 'AVATAR' LIMIT 1", nativeQuery = true)
    UserImages findAvatarByUserId(@Param("userId") int userId);


    @Query(value = "select * from user_images where user_id= :userId AND type= 'LICENSE_DRIVER'", nativeQuery = true)
    List<UserImages> findDrivingLicenseByUserId(@Param("userId") int userId);

    @Modifying
    @Query("DELETE FROM UserImages ui WHERE ui.user.id = :userId AND ui.type = :type")
    void deleteByUserIdAndType(@Param("userId") int userId, @Param("type") UserImageType type);

    @Modifying
    @Query("DELETE FROM UserImages ui WHERE ui.userDraft.id = :draftId")
    void deleteByUserDraftId(@Param("draftId") int draftId);


    @Query("""
        SELECT ui FROM UserImages ui 
        WHERE ui.userDraft.id = (
            SELECT MAX(ud.id) FROM UserDraft ud 
            WHERE ud.user.id = :userId 
        ) 
        AND ui.user IS NOT NULL 
        AND ui.type = 'LICENSE_DRIVER'
    """)
    List<UserImages> findDrivingLicenseByLatestDraftWithUser(@Param("userId") int userId);


    @Modifying
    @Query("""
    UPDATE UserImages ui 
    SET ui.user = NULL 
    WHERE ui.userDraft IN (
        SELECT ud FROM UserDraft ud WHERE ud.user.id = :userId
    ) 
    AND ui.type = 'LICENSE_DRIVER'
""")
    void resetUserInAllOldLicenseDrafts(@Param("userId") int userId);




    @Query("SELECT ui.imageUrl FROM UserImages ui WHERE ui.userDraft.id = :draftId AND ui.type = 'LICENSE_DRIVER'")
    List<String> findLicenseImagesByDraftId(@Param("draftId") int draftId);

    List<UserImages> findAllByUserIdAndType(int userId, UserImageType type);
}
