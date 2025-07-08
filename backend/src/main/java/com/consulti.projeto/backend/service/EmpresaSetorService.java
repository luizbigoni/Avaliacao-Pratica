package com.consulti.projeto.backend.service;

import com.consulti.projeto.backend.dto.EmpresaDTO;
import com.consulti.projeto.backend.dto.SetorDTO;
import com.consulti.projeto.backend.model.Empresa;
import com.consulti.projeto.backend.model.EmpresaSetor;
import com.consulti.projeto.backend.model.EmpresaSetorId;
import com.consulti.projeto.backend.model.Setor;
import com.consulti.projeto.backend.repository.EmpresaRepository;
import com.consulti.projeto.backend.repository.EmpresaSetorRepository;
import com.consulti.projeto.backend.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmpresaSetorService {
    @Autowired
    private EmpresaSetorRepository empresaSetorRepository;
    @Autowired
    private EmpresaRepository empresaRepository;
    @Autowired
    private SetorRepository setorRepository;

    @Transactional
    public EmpresaSetor vincularEmpresaSetor(Long empresaId, Long setorId) {
        Optional<Empresa> empresaOpt = empresaRepository.findById(empresaId);
        if (empresaOpt.isEmpty()) {
            throw new IllegalArgumentException("Empresa com ID " + empresaId + " não encontrada.");
        }
        Empresa empresa = empresaOpt.get();

        Optional<Setor> setorOpt = setorRepository.findById(setorId);
        if (setorOpt.isEmpty()) {
            throw new IllegalArgumentException("Setor com ID " + setorId + " não encontrado.");
        }
        Setor setor = setorOpt.get();

        EmpresaSetorId id = new EmpresaSetorId(empresaId, setorId);
        if (empresaSetorRepository.existsById(id)) {
            throw new IllegalArgumentException("Vínculo entre Empresa " + empresaId + " e Setor " + setorId + " já existe.");
        }

        EmpresaSetor empresaSetor = new EmpresaSetor(empresa, setor);
        return empresaSetorRepository.save(empresaSetor);
    }

    @Transactional
    public void desvincularEmpresaSetor(Long empresaId, Long setorId) {
        EmpresaSetorId id = new EmpresaSetorId(empresaId, setorId);
        if (!empresaSetorRepository.existsById(id)) {
            throw new IllegalArgumentException("Vínculo entre Empresa " + empresaId + " e Setor " + setorId + " não encontrado.");
        }
        empresaSetorRepository.deleteById(id);
    }

    public List<EmpresaSetor> listarTodosVinculos() {
        return empresaSetorRepository.findAll();
    }

    public Optional<EmpresaSetor> buscarVinculoPorId(Long empresaId, Long setorId) {
        EmpresaSetorId id = new EmpresaSetorId(empresaId, setorId);
        return empresaSetorRepository.findById(id);
    }

//    public List<Setor> listarSetoresPorEmpresa(Long empresaId) {
//        if (!empresaRepository.existsById(empresaId)) {
//            throw new IllegalArgumentException("Empresa com ID " + empresaId + " não encontrada.");
//        }
//        List<EmpresaSetor> vinculos = empresaSetorRepository.findByEmpresaId(empresaId);
//
//        return vinculos.stream().map(EmpresaSetor::getSetor).collect(Collectors.toList());
//    }
//
//    public List<Empresa> listarEmpresasPorSetor(Long setorId) {
//        if (!setorRepository.existsById(setorId)) {
//            throw new IllegalArgumentException("Setor com ID " + setorId + " não encontrado.");
//        }
//        List<EmpresaSetor> vinculos = empresaSetorRepository.findBySetorId(setorId);
//
//        return vinculos.stream().map(EmpresaSetor::getEmpresa).collect(Collectors.toList());
//    }
    public List<EmpresaDTO> listarEmpresasPorSetor(Long setorId) {
        if (!setorRepository.existsById(setorId)) {
            throw new IllegalArgumentException("Setor com ID " + setorId + " não encontrado.");
        }
        List<EmpresaSetor> vinculos = empresaSetorRepository.findBySetorId(setorId);
        return vinculos.stream()
                .map(es -> new EmpresaDTO(es.getEmpresa()))
                .collect(Collectors.toList());
    }

    public List<SetorDTO> listarSetoresPorEmpresa(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new IllegalArgumentException("Empresa com ID " + empresaId + " não encontrada.");
        }
        List<EmpresaSetor> vinculos = empresaSetorRepository.findByEmpresaId(empresaId);
        return vinculos.stream()
                .map(es -> new SetorDTO(es.getSetor()))
                .collect(Collectors.toList());
    }
}