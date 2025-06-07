package tn.ONT.gestion_ONT.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.Inputsoldedto;
import tn.ONT.gestion_ONT.dto.SoldeCongeDto;
import tn.ONT.gestion_ONT.service.SoldeCongeService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/solde-conge")
@RequiredArgsConstructor
public class SoldeCongeController {

    private final SoldeCongeService soldeCongeService;

    // ✅ Initialiser un solde pour un nouvel employé
    @PostMapping("/Initialiser-solde")
    public ResponseEntity<SoldeCongeDto> creerSolde(@RequestBody Inputsoldedto inputsoldedto) {
        
            SoldeCongeDto createdSolde = soldeCongeService.creerSolde(inputsoldedto);
            return new ResponseEntity<>(createdSolde, HttpStatus.CREATED);
        
    }

    // ✅ Consulter le solde d'un employé pour une année donnée
    @GetMapping("/{employeId}/{annee}")
    public ResponseEntity<SoldeCongeDto> consulterSolde(@PathVariable Long employeId, 
                                                        @PathVariable int annee) {
        try {
            SoldeCongeDto solde = soldeCongeService.consulterSolde(employeId, annee);
            return new ResponseEntity<>(solde, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // ✅ Historique des soldes d'un employé
    @GetMapping("/historique/{employeId}")
    public ResponseEntity<List<SoldeCongeDto>> historiqueSoldes(@PathVariable Long employeId) {
        try {
            List<SoldeCongeDto> historique = soldeCongeService.historiqueSoldes(employeId);
            return new ResponseEntity<>(historique, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // ✅ Mettre à jour manuellement un solde (admin/RH)
    @PutMapping("/{soldeId}")
    public ResponseEntity<SoldeCongeDto> modifierSolde(@PathVariable Long soldeId, 
                                                       @RequestParam int nouveauSoldeDisponible) {
        try {
            SoldeCongeDto updatedSolde = soldeCongeService.modifierSolde(soldeId, nouveauSoldeDisponible);
            return new ResponseEntity<>(updatedSolde, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}

