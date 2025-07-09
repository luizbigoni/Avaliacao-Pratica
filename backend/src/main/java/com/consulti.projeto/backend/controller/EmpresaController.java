package com.consulti.projeto.backend.controller;

import com.consulti.projeto.backend.model.Empresa;
import com.consulti.projeto.backend.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {
    @Autowired
    private EmpresaService empresaService;

//    @PostMapping("/novo")
//    public ResponseEntity<Empresa> createEmpresa(@RequestBody Empresa empresa){
//        try{
//            Empresa novaEmpresa = empresaService.create(empresa);
//            return new ResponseEntity<>(novaEmpresa, HttpStatus.CREATED);
//        }catch(IllegalArgumentException e){
//            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
//        }catch(Exception e){
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    @PostMapping("/novo")
    public ResponseEntity<?> createEmpresa(@RequestBody Empresa empresa){
        try {
            Empresa nova = empresaService.create(empresa);
            return new ResponseEntity<>(nova, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage())); // <- garante JSON válido
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro inesperado ao cadastrar empresa."));
        }
    }


    @GetMapping("/listar")
    public ResponseEntity<List<Empresa>> getAllEmpresas(){
        List<Empresa> empresas=empresaService.read();
        if(empresas.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(empresas, HttpStatus.OK);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Empresa> updateEmpresa(@PathVariable Long id, @RequestBody Empresa empresa){
        empresa.setId(id);
        try{
            Empresa novaEmpresa = empresaService.update(empresa);
            return new ResponseEntity<>(novaEmpresa, HttpStatus.OK);
        }catch(IllegalArgumentException e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }catch(Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/excluir/{id}")
    public ResponseEntity<Empresa> deleteEmpresa(@PathVariable Long id){
        try{
            empresaService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(IllegalArgumentException e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }catch(Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/buscarId/{id}")
    public ResponseEntity<Empresa> buscarEmpresaId(@PathVariable Long id){
        return empresaService.buscaPorId(id).map(empresa -> new ResponseEntity<>(empresa, HttpStatus.OK)).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/buscarCnpj/{cnpj}")
    public ResponseEntity<Empresa> buscarEmpresaCnpj(@PathVariable String cnpj){
        Empresa empresa = empresaService.buscaPorCnpj(cnpj);
        if(empresa != null){
            return new ResponseEntity<>(empresa, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Empresa>> buscarEmpresas(@RequestParam("query") String query) {
        List<Empresa> empresas = empresaService.buscarPorRazaoSocialOuCnpj(query);
        if (empresas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(empresas, HttpStatus.OK);
    }

}
