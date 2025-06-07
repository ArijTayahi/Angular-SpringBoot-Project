package tn.ONT.gestion_ONT.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.entity.AjoutJourFerieRequest;
import tn.ONT.gestion_ONT.entity.JourFerie;
import tn.ONT.gestion_ONT.service.JoursFeriesService;

@RestController
@RequestMapping("/api/v1/jours-feries")
@RequiredArgsConstructor
public class JoursFeriesController {
  
    private final JoursFeriesService jourFerieService;
  
    @GetMapping("/{annee}")
    public ResponseEntity<List<JourFerie>> getJoursFeriesAnnee(@PathVariable int annee) {
        List<JourFerie> joursFeries = jourFerieService.getJoursFeriesAnnee(annee);
        return ResponseEntity.ok(joursFeries);
    }
  
    @PostMapping("/islamique")
    public ResponseEntity<JourFerie> ajouterJourFerieIslamique(
            @RequestBody AjoutJourFerieRequest request,
            @RequestParam String adminId) {
       
        try {
            JourFerie jourFerie = jourFerieService.ajouterJourFerieIslamique(
                request.getNom(),
                request.getDate(),
                request.getDescription(),
                adminId
            );
            return ResponseEntity.ok(jourFerie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
  
    @PostMapping("/islamiques/{annee}")
    public ResponseEntity<String> creerJoursFeriesIslamiques(
            @PathVariable int annee,
            @RequestBody Map<String, Date> datesFeries,
            @RequestParam String adminId) {
       
        try {  
            jourFerieService.creerJoursFeriesIslamiques(annee, datesFeries, adminId);
            return ResponseEntity.ok("Jours fériés islamiques créés pour " + annee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création");
        }
    }
  
    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimerJourFerie(@PathVariable Long id, @RequestParam String adminId) {
        try {
            jourFerieService.supprimerJourFerie(id, adminId);
            return ResponseEntity.ok("Jour férié supprimé");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

