package com.consulti.projeto.backend.service;

import com.consulti.projeto.backend.model.Empresa;
import com.consulti.projeto.backend.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa create(Empresa empresa){
        if(empresaRepository.existsByCnpj(empresa.getCnpj())){
            throw new IllegalArgumentException("CNPJ ja existente");
        }
        return empresaRepository.save(empresa);
    }

    public List<Empresa> read(){
        return empresaRepository.findAll();
    }

    public Empresa update(Empresa empresa){
        if(empresa.getId() == null || !empresaRepository.existsById(empresa.getId())){
            throw new IllegalArgumentException("Empresa não encontrada");
        }
        return empresaRepository.save(empresa);
    }

    public void delete(Long id){
        empresaRepository.deleteById(id);
    }

    public Optional<Empresa> buscaPorId(Long id){
        return empresaRepository.findById(id);
    }

    public Empresa buscaPorCnpj(String cnpj){
        return empresaRepository.findByCnpj(cnpj);
    }
}
