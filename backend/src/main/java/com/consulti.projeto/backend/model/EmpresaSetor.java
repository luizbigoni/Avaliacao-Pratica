package com.consulti.projeto.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "empresa_setor")
public class EmpresaSetor {
    @EmbeddedId
    private EmpresaSetorId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("empresaId")
    @JoinColumn(name = "empresa_id")
    @JsonBackReference
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("setorId")
    @JoinColumn(name = "setor_id")
    @JsonBackReference(value = "setor-ref")
    private Setor setor;

    public EmpresaSetor() {}

    public EmpresaSetor(Empresa empresa, Setor setor) {
        this.empresa = empresa;
        this.setor = setor;
        this.id = new EmpresaSetorId(empresa.getId(), setor.getId());
    }

    public EmpresaSetorId getId() { return id; }
    public void setId(EmpresaSetorId id) { this.id = id; }

    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public Setor getSetor() { return setor; }
    public void setSetor(Setor setor) { this.setor = setor; }
}