package com.consulti.projeto.backend.dto;

import com.consulti.projeto.backend.model.EmpresaSetor;
import com.consulti.projeto.backend.model.EmpresaSetorId;

public class EmpresaSetorResponseDTO {
    private EmpresaSetorId id;
    private EmpresaDTO empresa;
    private SetorDTO setor;

    public EmpresaSetorResponseDTO() {
    }
    public EmpresaSetorResponseDTO(EmpresaSetor empresaSetor) {
        this.id = empresaSetor.getId();
        if (empresaSetor.getEmpresa() != null)
            this.empresa = new EmpresaDTO(empresaSetor.getEmpresa());

        if (empresaSetor.getSetor() != null)
            this.setor = new SetorDTO(empresaSetor.getSetor());
    }

    public EmpresaSetorId getId() {
        return id;
    }
    public void setId(EmpresaSetorId id) {
        this.id = id;
    }

    public EmpresaDTO getEmpresa() {
        return empresa;
    }
    public void setEmpresa(EmpresaDTO empresa) {
        this.empresa = empresa;
    }

    public SetorDTO getSetor() {
        return setor;
    }
    public void setSetor(SetorDTO setor) {
        this.setor = setor;
    }
}