package com.pjb2.rental_car.dto.request;

import com.pjb2.rental_car.util.EnumValue;
import com.pjb2.rental_car.util.common.VoucherScope;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CarOwnerVoucherEditRequest {
    @NotBlank(message = "Name can not be blanked")
    private String name;
    private String description;
    @NotNull(message = "Scope can not be null")
    @EnumValue(name="scope", enumClass = VoucherScope.class)
    private String scope;
    private List<Integer> listCarId;
    private Date startDate;
    private Date endDate;
    @Min(value = -1,message = "quantity can not lower than -1")
    private Integer quantity;
    @Min(value = 0,message = "percentRate can not lower than -1")
    private double percentRate;
    @Min(value = 0,message = "maxPrice can not lower than -1")
    private double maxPrice;
    @Min(value = 0,message = "fixedPrice can not lower than -1")
    private double fixedPrice;
    private String code;
}
