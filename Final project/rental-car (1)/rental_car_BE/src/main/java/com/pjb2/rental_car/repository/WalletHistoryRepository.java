package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.dto.response.ChartResponse;
import com.pjb2.rental_car.entity.WalletHistory;
import com.pjb2.rental_car.util.common.WalletHistoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface WalletHistoryRepository extends JpaRepository<WalletHistory, Integer> {
    Page<WalletHistory> findByWalletId(int id, Pageable pageable);
    Page<WalletHistory> findByWalletIdAndCreatedAtBetween(int walletId, LocalDateTime from, LocalDateTime to, Pageable pageable);

    @Query(value = """
    WITH RECURSIVE date_series AS (
        SELECT DATE_FORMAT(NOW(), '%Y-%m-01') AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM date_series
        WHERE date < LAST_DAY(NOW())
        )
        SELECT
            DATE_FORMAT(ds.date, '%d/%m') AS label,
            COALESCE(SUM(w.amount), 0) AS value
            FROM date_series ds
            LEFT JOIN wallet_history w
            ON DATE(w.created_at) = ds.date
            AND w.type = 'RENTED'
            AND w.wallet_id= :walletId
            GROUP BY ds.date
            ORDER BY ds.date
    """,nativeQuery = true)
    List<ChartResponse> findByDataForIncomeBarCharByMonth(@Param("walletId") int walletId);


    @Query(value = """
        WITH RECURSIVE date_series AS (
            SELECT DATE_FORMAT(NOW(), '%Y-%m-01') AS date
            UNION ALL
            SELECT DATE_ADD(date, INTERVAL 1 DAY)
            FROM date_series
            WHERE date < LAST_DAY(NOW())
            )
            SELECT
                DATE_FORMAT(ds.date, '%d/%m') AS label,
                COALESCE(SUM(wh.amount), 0) AS value
                FROM date_series ds
                LEFT JOIN wallet_history wh
                LEFT JOIN wallet w ON wh.wallet_id = w.id
                ON DATE(wh.created_at) = ds.date
                AND wh.type = 'RENTED'
                AND w.wallet_type = 'ADMIN_WALLET'
                GROUP BY ds.date
                ORDER BY ds.date
    """,nativeQuery = true)
    List<ChartResponse> findByDataForAdminIncomeBarCharByMonth();


    @Query(value = """
    SELECT * FROM wallet_history 
    WHERE type = :type
      AND created_at >= :startDate
      AND created_at <= :endDate
      AND wallet_id= :walletId
""",nativeQuery = true)
    List<WalletHistory> findWalletHistoryByTypeAndDateRange(
            @Param("walletId") int walletId,
            @Param("type") WalletHistoryType type,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query(value = """
    SELECT * FROM wallet_history
    WHERE type = :type
      AND created_at BETWEEN DATE_SUB(:startDate, INTERVAL 1 WEEK)
                         AND DATE_SUB(:endDate, INTERVAL 1 WEEK)
        AND wallet_id= :walletId
    """, nativeQuery = true)
    List<WalletHistory> findWalletHistoryOfLastWeek(
            @Param("walletId") int walletId,
            @Param("type") WalletHistoryType type,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );
    @Query(value = """
    SELECT * FROM wallet_history
    WHERE type = :type
      AND created_at BETWEEN DATE_SUB(:startDate, INTERVAL 1 MONTH)
                         AND DATE_SUB(:endDate, INTERVAL 1 MONTH)
        AND wallet_id= :walletId
    """, nativeQuery = true)
    List<WalletHistory> findWalletHistoryOfLastMonth(
            @Param("walletId") int walletId,
            @Param("type") WalletHistoryType type,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

}
