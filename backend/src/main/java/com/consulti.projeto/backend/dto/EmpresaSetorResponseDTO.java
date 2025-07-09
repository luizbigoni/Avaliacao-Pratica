package com.consulti.projeto.backend.dto;

import com.consulti.projeto.backend.model.EmpresaSetor;
import com.consulti.projeto.backend.model.EmpresaSetorId; // Certifique-se de importar a chave composta

// Você pode usar Lombok aqui se preferir para getters/setters/construtores
// import lombok.Data;

// @Data // Se estiver usando Lombok
public class EmpresaSetorResponseDTO {
    private EmpresaSetorId id; // A chave composta do vínculo
    private EmpresaDTO empresa; // Utilize o seu EmpresaDTO existente
    private SetorDTO setor;     // Utilize o seu SetorDTO existente

    public EmpresaSetorResponseDTO() {
    }

    // Construtor para converter a entidade EmpresaSetor em EmpresaSetorResponseDTO
    public EmpresaSetorResponseDTO(EmpresaSetor empresaSetor) {
        this.id = empresaSetor.getId(); // Atribui a chave composta

        // Converte a entidade Empresa em seu DTO correspondente
        if (empresaSetor.getEmpresa() != null) {
            this.empresa = new EmpresaDTO(empresaSetor.getEmpresa()); // Chama o construtor do seu EmpresaDTO
        }

        // Converte a entidade Setor em seu DTO correspondente
        if (empresaSetor.getSetor() != null) {
            this.setor = new SetorDTO(empresaSetor.getSetor()); // Chama o construtor do seu SetorDTO
        }
    }

    // Getters e Setters
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