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

//    @PutMapping("/editar/{id}")
//    public ResponseEntity<Setor> updateEmpresa(@PathVariable Long id, @RequestBody Setor setor){
//        setor.setId(id);
//        try{
//            Setor novoSetor = setorService.update(setor);
//            return new ResponseEntity<>(novoSetor, HttpStatus.OK);
//        }catch(IllegalArgumentException e){
//            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
//        }catch(Exception e){
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    @PutMapping("/editar/{id}") // <<-- MUDANÇA AQUI: Recebe ID do path e Setor no corpo
    public ResponseEntity<Setor> updateSetor(@PathVariable Long id, @RequestBody Setor setor) {
        try {
            Setor setorAtualizado = setorService.update(id, setor); // Passa o ID e o objeto Setor
            return new ResponseEntity<>(setorAtualizado, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // Setor não encontrado
        } catch (Exception e) {
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

    @GetMapping("/buscarId/{id}") // <<-- ESTE É O ENDPOINT NECESSÁRIO
    public ResponseEntity<Setor> buscarSetorId(@PathVariable Long id) {
        return setorService.buscaPorId(id)
                .map(setor -> new ResponseEntity<>(setor, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/buscar") // <<-- ESTE É O ENDPOINT QUE O FRONTEND ESTÁ CHAMANDO
    public ResponseEntity<List<Setor>> buscarSetores(@RequestParam("query") String query) {
        try {
            List<Setor> setores = setorService.buscarPorDescricao(query); // Chama o serviço para buscar
            if (setores.isEmpty()) {
                return new ResponseEntity<>(setores, HttpStatus.OK); // Retorna 200 OK com lista vazia
            }
            return new ResponseEntity<>(setores, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Erro ao buscar setores por termo: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
