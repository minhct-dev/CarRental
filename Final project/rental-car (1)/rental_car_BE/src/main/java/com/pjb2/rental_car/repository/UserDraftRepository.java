package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.UserDraft;
import com.pjb2.rental_car.entity.UserImages;
import com.pjb2.rental_car.util.common.UserDraftStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserDraftRepository extends JpaRepository<UserDraft, Integer> {
    Optional<UserDraft> findByUserId(int userId);
    Optional<UserDraft> findTopByUserIdOrderByIdDesc(int userId);

    @Query("""
        SELECT ud FROM UserDraft ud 
        WHERE ud.user.id = :userId AND ud.id < :draftId 
        ORDER BY ud.id DESC LIMIT 1
    """)
    Optional<UserDraft> findPreviousDraftWithUser(@Param("userId") int userId, @Param("draftId") int draftId);

    Optional<UserDraft> findByUserIdAndIsDeletedFalse(int userId);

    Optional<UserDraft> findFirstByUserIdAndStatus(int userId, UserDraftStatus status);

    Page<UserDraft> findByStatus(UserDraftStatus status, Pageable pageable);

    @Query("SELECT u FROM UserDraft u WHERE " +
            "(LOWER(u.user.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.user.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<UserDraft> findBySearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM UserDraft u WHERE u.status = :status AND " +
            "(LOWER(u.user.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.user.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<UserDraft> findByStatusAndSearch(@Param("status") UserDraftStatus status,
                                          @Param("search") String search,
                                          Pageable pageable);

    long countByStatus(UserDraftStatus status);
}
