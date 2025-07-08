package com.consulti.projeto.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "setor")
public class Setor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "descricao", nullable = false)
    private String descricao;

    public Setor() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    //@JsonIgnore
    @OneToMany(mappedBy = "setor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "setor-ref")
    private Set<EmpresaSetor> empresaSetores = new HashSet<>();

    public Set<EmpresaSetor> getEmpresaSetores() {
        return empresaSetores;
    }
    public void setEmpresaSetores(Set<EmpresaSetor> empresaSetores) {
        this.empresaSetores = empresaSetores;
    }
}
