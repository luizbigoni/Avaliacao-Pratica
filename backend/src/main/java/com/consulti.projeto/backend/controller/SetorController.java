package com.consulti.projeto.backend.controller;

import com.consulti.projeto.backend.model.Setor;
import com.consulti.projeto.backend.service.SetorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/setores")
public class SetorController {
    @Autowired
    private SetorService setorService;

    @PostMapping("/novo")
    public ResponseEntity<Setor> createSetor(@RequestBody Setor setor){
        try{
            Setor novoSetor = setorService.create(setor);
            return new ResponseEntity<>(novoSetor, HttpStatus.CREATED);
        }catch(IllegalArgumentException e){
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }catch(Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Setor>> getAllSetores(){
        List<Setor> setor=setorService.read();
        if(setor.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(setor, HttpStatus.OK);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Setor> updateEmpresa(@PathVariable Long id, @RequestBody Setor setor){
        setor.setId(id);
        try{
            Setor novoSetor = setorService.update(setor);
            return new ResponseEntity<>(novoSetor, HttpStatus.OK);
        }catch(IllegalArgumentException e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }catch(Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/excluir/{id}")
    public ResponseEntity<Void> deleteSetor(@PathVariable Long id){
        try{
            setorService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(IllegalArgumentException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
