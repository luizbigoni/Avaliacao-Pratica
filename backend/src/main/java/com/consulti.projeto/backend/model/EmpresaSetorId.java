package com.consulti.projeto.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class EmpresaSetorId implements Serializable {
    @Column(name = "empresa_id")
    private Long empresaId;
    @Column(name = "setor_id")
    private Long setorId;

    public EmpresaSetorId() {}
    public EmpresaSetorId(Long empresaId, Long setorId) {
        this.empresaId = empresaId;
        this.setorId = setorId;
    }

    public Long getEmpresaId() { return empresaId; }
    public void setEmpresaId(Long empresaId) { this.empresaId = empresaId; }

    public Long getSetorId() { return setorId; }
    public void setSetorId(Long setorId) { this.setorId = setorId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmpresaSetorId that = (EmpresaSetorId) o;
        return Objects.equals(empresaId, that.empresaId) &&
                Objects.equals(setorId, that.setorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(empresaId, setorId);
    }
}