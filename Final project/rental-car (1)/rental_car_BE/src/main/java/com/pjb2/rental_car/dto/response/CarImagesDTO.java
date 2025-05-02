package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.util.common.CarImageType;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarImagesDTO {
    private int id;
    private String url;
    private CarImageType type;
}
