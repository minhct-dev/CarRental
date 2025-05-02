package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDraftPageResponse  {
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private List<Map<String, Object>> drafts;

    private long numberOfAll;
    private long numberOfPending;
    private long numberOfApprove;
    private long numberOfReject;
}
