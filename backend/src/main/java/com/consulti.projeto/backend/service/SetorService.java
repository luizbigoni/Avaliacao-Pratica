package com.consulti.projeto.backend.service;

import com.consulti.projeto.backend.model.Empresa;
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
    public Setor update(Long id, Setor setorAtualizado) { // Recebe o ID do path e o objeto atualizado
        // 1. Encontra o Setor existente no banco de dados
        Optional<Setor> setorOpt = setorRepository.findById(id);
        if (setorOpt.isEmpty()) {
            throw new IllegalArgumentException("Setor não encontrado para atualização.");
        }
        Setor setorExistente = setorOpt.get(); // O setor existente do banco

        // 2. Atualiza APENAS as propriedades do setor existente com os dados que vieram na requisição
        setorExistente.setDescricao(setorAtualizado.getDescricao());

        // 3. Salva a entidade existente (o Hibernate fará o merge e manterá os vínculos)
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
