package com.consulti.projeto.backend.service;

import com.consulti.projeto.backend.model.Empresa;
import com.consulti.projeto.backend.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
        if(empresaRepository.existsByRazaoSocialIgnoreCase(empresa.getRazaoSocial())){
            throw new IllegalArgumentException("Já existe uma empresa com esta Razão Social.");
        }
        return empresaRepository.save(empresa);
    }

    public List<Empresa> read(){
        return empresaRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

//    public Empresa update(Empresa empresa){
//        if(empresa.getId() == null || !empresaRepository.existsById(empresa.getId())){
//            throw new IllegalArgumentException("Empresa não encontrada");
//        }
//        return empresaRepository.save(empresa);
//    }
    public Empresa update(Empresa empresa){
        if (empresa.getId() == null || !empresaRepository.existsById(empresa.getId())) {
            throw new IllegalArgumentException("ID da empresa é obrigatório");
        }

        Empresa existente = empresaRepository.findById(empresa.getId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));

        if (!empresa.getCnpj().equals(existente.getCnpj())
                && empresaRepository.existsByCnpj(empresa.getCnpj())) {
            throw new IllegalArgumentException("Já existe uma empresa cadastrada com este CNPJ.");
        }

        if (!empresa.getRazaoSocial().equalsIgnoreCase(existente.getRazaoSocial())
                && empresaRepository.existsByRazaoSocialIgnoreCase(empresa.getRazaoSocial())) {
            throw new IllegalArgumentException("Já existe uma empresa com esta Razão Social.");
        }
        // Atualiza apenas os campos simples
        existente.setRazaoSocial(empresa.getRazaoSocial());
        existente.setNomeFantasia(empresa.getNomeFantasia());
        existente.setCnpj(empresa.getCnpj());

        // NÃO TOQUE EM setores aqui! Os vínculos são controlados separadamente.

        return empresaRepository.save(existente);
    }
//    public Empresa update(Empresa empresa){
//        if(empresa.getId() == null || !empresaRepository.existsById(empresa.getId())){
//            throw new IllegalArgumentException("Empresa não encontrada.");
//        }
//
//        Empresa existente = empresaRepository.findById(empresa.getId()).orElseThrow();
//
//        if (!empresa.getCnpj().equals(existente.getCnpj())
//                && empresaRepository.existsByCnpj(empresa.getCnpj())) {
//            throw new IllegalArgumentException("Já existe uma empresa cadastrada com este CNPJ.");
//        }
//
//        if (!empresa.getRazaoSocial().equalsIgnoreCase(existente.getRazaoSocial())
//                && empresaRepository.existsByRazaoSocialIgnoreCase(empresa.getRazaoSocial())) {
//            throw new IllegalArgumentException("Já existe uma empresa com esta Razão Social.");
//        }
//
//        return empresaRepository.save(empresa);
//    }


    public void delete(Long id){
        empresaRepository.deleteById(id);
    }

    public Optional<Empresa> buscaPorId(Long id){
        return empresaRepository.findById(id);
    }

    public Empresa buscaPorCnpj(String cnpj){
        return empresaRepository.findByCnpj(cnpj);
    }

    public List<Empresa> buscarPorRazaoSocialOuCnpj(String termo) {
        return empresaRepository.findByRazaoSocialContainingIgnoreCaseOrCnpjContainingIgnoreCase(termo, termo);
    }
}
