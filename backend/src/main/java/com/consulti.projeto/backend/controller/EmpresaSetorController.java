package com.consulti.projeto.backend.controller;

import com.consulti.projeto.backend.dto.EmpresaDTO;
import com.consulti.projeto.backend.dto.SetorDTO;
import com.consulti.projeto.backend.model.EmpresaSetor;
import com.consulti.projeto.backend.service.EmpresaSetorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas_setores")
public class EmpresaSetorController {
    @Autowired
    private EmpresaSetorService empresaSetorService;

    @PostMapping("/vincular/{empresaId}/{setorId}")
    public ResponseEntity<EmpresaSetor> vincular(@PathVariable Long empresaId, @PathVariable Long setorId) {
        try{
            EmpresaSetor novoVinculo = empresaSetorService.vincularEmpresaSetor(empresaId, setorId);
            return new ResponseEntity<>(novoVinculo, HttpStatus.CREATED);
        }catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/desvincular/{empresaId}/{setorId}")
    public ResponseEntity<Void> desvincular(@PathVariable Long empresaId, @PathVariable Long setorId) {
        try {
            empresaSetorService.desvincularEmpresaSetor(empresaId, setorId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<EmpresaSetor>> listarVinculos() {
        List<EmpresaSetor> vinculos = empresaSetorService.listarTodosVinculos();
        if (vinculos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(vinculos, HttpStatus.OK);
    }

    @GetMapping("/buscar/{empresaId}/{setorId}")
    public ResponseEntity<EmpresaSetor> buscarVinculo(@PathVariable Long empresaId, @PathVariable Long setorId) {
        return empresaSetorService.buscarVinculoPorId(empresaId, setorId)
                .map(vinculo -> new ResponseEntity<>(vinculo, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @GetMapping("/buscaEmpresasPorSetor/{setorId}")
    public ResponseEntity<List<EmpresaDTO>> listarEmpresasPorSetor(@PathVariable Long setorId) {
        try {
            List<EmpresaDTO> empresas = empresaSetorService.listarEmpresasPorSetor(setorId);
            if (empresas.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(empresas, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/buscaSetoresPorEmpresa/{empresaId}")
    public ResponseEntity<List<SetorDTO>> listarSetoresPorEmpresa(@PathVariable Long empresaId) {
        try {
            List<SetorDTO> setores = empresaSetorService.listarSetoresPorEmpresa(empresaId);
            if (setores.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(setores, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}