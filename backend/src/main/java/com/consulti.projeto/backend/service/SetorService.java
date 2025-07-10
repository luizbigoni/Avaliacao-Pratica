package com.consulti.projeto.backend.service;

import com.consulti.projeto.backend.model.Setor;
import com.consulti.projeto.backend.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
        return setorRepository.findAll(Sort.by("id").ascending());
    }

//    public Setor update(Setor setor){
//        if(setor.getId() == null || !setorRepository.existsById(setor.getId())){
//            throw new IllegalArgumentException("Setor não encontrado");
//        }
//        return setorRepository.save(setor);
//    }
    public Setor update(Long id, Setor setorAtualizado) {
        Optional<Setor> setorOpt = setorRepository.findById(id);
        if (setorOpt.isEmpty()) {
            throw new IllegalArgumentException("Setor não encontrado para atualização.");
        }
        Setor setorExistente = setorOpt.get();
        setorExistente.setDescricao(setorAtualizado.getDescricao());
        return setorRepository.save(setorExistente);
    }

    public void delete(Long id){
        setorRepository.deleteById(id);
    }

    public Optional<Setor> buscaPorId(Long id){
        return setorRepository.findById(id);
    }

    public List<Setor> buscarPorDescricao(String termo) {
        return setorRepository.findByDescricaoContainingIgnoreCase(termo);
    }
}
