package com.consulti.projeto.backend.repository;

import com.consulti.projeto.backend.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    // Métodos de CRUD básicos já são fornecidos pelo JpaRepository:
    // -> save(Empresa empresa): Para criar ou atualizar uma empresa.
    // -> findById(Long id): Para buscar uma empresa por ID. Retorna Optional<Empresa>.
    // -> findAll(): Para listar todas as empresas. Retorna List<Empresa>.
    // -> deleteById(Long id): Para excluir uma empresa por ID.

    Empresa findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
    boolean existsByRazaoSocialIgnoreCase(String razaoSocial);
    List<Empresa> findByRazaoSocialContainingIgnoreCaseOrCnpjContainingIgnoreCase(String termoRazaoSocial, String termoCnpj);
}