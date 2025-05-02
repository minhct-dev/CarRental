package com.pjb2.rental_car.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class  OpenApiConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().
                info(new Info().title("Rental Car Api Service").version("1.0.0"))
                .servers(List.of(new Server().url("http://localhost:8080")))
                .openapi("3.0.1");
    }

    @Bean
    public GroupedOpenApi groupedOpenApi() {
        return GroupedOpenApi.builder()
                .group("rental_car")
                .packagesToScan("com.pjb2.rental_car.controller")
                .build();
    }
}
