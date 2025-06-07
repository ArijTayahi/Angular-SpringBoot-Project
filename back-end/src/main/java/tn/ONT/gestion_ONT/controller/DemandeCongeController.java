package tn.ONT.gestion_ONT.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.DemandeCongeDto;
import tn.ONT.gestion_ONT.service.DemandeCongeService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/demandes-conge")
@RequiredArgsConstructor
public class DemandeCongeController {

    private final DemandeCongeService demandeCongeService;

    @PostMapping("/save")
    public ResponseEntity<DemandeCongeDto> creerDemande(@RequestBody DemandeCongeDto demandeCongeDto
                                                     ) {
        
            DemandeCongeDto createdDemande = demandeCongeService.creerDemande(demandeCongeDto);
            return new ResponseEntity<>(createdDemande, HttpStatus.CREATED);
      
    }

    @PutMapping("/{demandeId}/valider")
    public ResponseEntity<DemandeCongeDto> validerDemande(@PathVariable Long demandeId, @RequestParam boolean approuve) {
       
            DemandeCongeDto updatedDemande = demandeCongeService.validerDemande(demandeId, approuve);
            return new ResponseEntity<>(updatedDemande, HttpStatus.OK);
    
    }

    @GetMapping("/historique/{employeId}")
    public ResponseEntity<List<DemandeCongeDto>> historiqueConges() {
        try {
            List<DemandeCongeDto> historique = demandeCongeService.historiqueConges();
            return new ResponseEntity<>(historique, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/All")
    public ResponseEntity<List<DemandeCongeDto>> toutesLesDemandes() {
        try {
            List<DemandeCongeDto> toutesLesDemandes = demandeCongeService.toutesLesDemandes();
            return new ResponseEntity<>(toutesLesDemandes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerDemande(@PathVariable Long id) {
        try {
            demandeCongeService.supprimerDemande(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/modifier/{id}")
    public ResponseEntity<DemandeCongeDto> modifierDemande(
            @PathVariable("id") Long id,
            @RequestBody DemandeCongeDto dto) {
        return ResponseEntity.ok(demandeCongeService.modifierDemande(id, dto));
    }

}

