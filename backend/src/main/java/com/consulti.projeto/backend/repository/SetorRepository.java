package com.consulti.projeto.backend.repository;

import com.consulti.projeto.backend.model.Setor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long> {
    // Métodos de CRUD básicos já são fornecidos pelo JpaRepository:
    // -> save(Setor setor): Para criar ou atualizar uma setor.
    // -> findById(Long id): Para buscar um setor por ID. Retorna Optional<Setor>.
    // -> findAll(): Para listar todas os setores. Retorna List<Setor>.
    // -> deleteById(Long id): Para excluir um setor por ID.

    List<Setor> findByDescricaoContainingIgnoreCase(String descricao);
}
