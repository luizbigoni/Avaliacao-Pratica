package com.consulti.projeto.backend.repository;

import com.consulti.projeto.backend.model.EmpresaSetor;
import com.consulti.projeto.backend.model.EmpresaSetorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaSetorRepository extends JpaRepository<EmpresaSetor, EmpresaSetorId> {
    List<EmpresaSetor> findByEmpresaId(Long empresaId);
    List<EmpresaSetor> findBySetorId(Long setorId);
    List<EmpresaSetor> findByEmpresaIdAndSetorId(Long empresaId, Long setorId);

    @Query(value = "SELECT es FROM EmpresaSetor es JOIN FETCH es.empresa e JOIN FETCH es.setor s WHERE " +
            "(:empresaTerm IS NULL OR " +
            "LOWER(CAST(e.razaoSocial AS text)) LIKE :empresaTerm OR " +
            "LOWER(CAST(e.cnpj AS text)) LIKE :empresaTerm) AND " +
            "(:setorTerm IS NULL OR " +
            "LOWER(CAST(s.descricao AS text)) LIKE :setorTerm)")
    List<EmpresaSetor> findByEmpresaRazaoSocialOrCnpjAndSetorDescricao(
            @Param("empresaTerm") String empresaTerm,
            @Param("setorTerm") String setorTerm);
}