package com.consulti.projeto.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todos os endpoints da sua API (/**)
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost") // <<-- ADICIONE A URL DO SEU FRONTEND AQUI
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite os métodos HTTP que sua API utiliza
                .allowedHeaders("*") // Permite todos os cabeçalhos
                .allowCredentials(true); // Permite o envio de credenciais (se for usar cookies/sessões no futuro)
    }
}