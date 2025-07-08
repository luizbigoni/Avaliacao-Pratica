package com.consulti.projeto.backend.dto;

import com.consulti.projeto.backend.model.Setor;

public class SetorDTO {
    private Long id;
    private String nome;

    public SetorDTO(Setor setor) {
        this.id = setor.getId();
        this.nome = setor.getDescricao();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
