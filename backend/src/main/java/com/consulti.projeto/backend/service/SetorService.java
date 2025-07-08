package com.consulti.projeto.backend.service;

import com.consulti.projeto.backend.model.Empresa;
import com.consulti.projeto.backend.model.Setor;
import com.consulti.projeto.backend.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SetorService {
    @Autowired
    private SetorRepository setorRepository;

    public Setor create(Setor setor){
        return setorRepository.save(setor);
    }

    public List<Setor> read(){
        return setorRepository.findAll();
    }

    public Setor update(Setor setor){
        if(setor.getId() == null || !setorRepository.existsById(setor.getId())){
            throw new IllegalArgumentException("Setor não encontrado");
        }
        return setorRepository.save(setor);
    }

    public void delete(Long id){
        setorRepository.deleteById(id);
    }

    public Optional<Setor> buscaPorId(Long id){
        return setorRepository.findById(id);
    }
}
