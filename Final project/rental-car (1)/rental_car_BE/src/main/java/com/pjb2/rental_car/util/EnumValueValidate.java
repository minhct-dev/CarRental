package com.pjb2.rental_car.util;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;
import java.util.stream.Stream;

public class EnumValueValidate implements ConstraintValidator<EnumValue, CharSequence> {
    private List acceptedValue;
    @Override
    public void initialize(EnumValue enumValue) {
        acceptedValue = Stream.of(enumValue.enumClass().getEnumConstants())
                .map(Enum::name)
                .toList();
    }

    @Override
    public boolean isValid(CharSequence value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null) {
            return true;
        }

        return acceptedValue.contains(value.toString().toUpperCase());
    }
}
