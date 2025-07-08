package com.consulti.projeto.backend.repository;

import com.consulti.projeto.backend.model.EmpresaSetor;
import com.consulti.projeto.backend.model.EmpresaSetorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaSetorRepository extends JpaRepository<EmpresaSetor, EmpresaSetorId> {
    List<EmpresaSetor> findByEmpresaId(Long empresaId);
    List<EmpresaSetor> findBySetorId(Long setorId);
}