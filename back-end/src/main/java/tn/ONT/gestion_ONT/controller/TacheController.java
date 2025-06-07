package tn.ONT.gestion_ONT.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.TacheDto;
import tn.ONT.gestion_ONT.dto.Tachesempdto;
import tn.ONT.gestion_ONT.dto.Tachesempdto;
import tn.ONT.gestion_ONT.entity.EtatTache;
import tn.ONT.gestion_ONT.service.TacheService;

@RestController
@RequestMapping("/api/v1/taches")
@RequiredArgsConstructor
public class TacheController {

    private final TacheService tacheService;

    @PostMapping("/savetachetoemp")
    public ResponseEntity<TacheDto> creerTache(@RequestBody Tachesempdto dto) {
        return ResponseEntity.ok(tacheService.creerTache(dto ));
    }

    @PutMapping("/{id}/create")
    public ResponseEntity<TacheDto> modifier(@PathVariable Long id, @RequestBody TacheDto dto) {
        return ResponseEntity.ok(tacheService.modifierTache(id, dto));
    }

    @DeleteMapping("/{id}/delete")
    public void supprimer(@PathVariable Long id) {
        tacheService.supprimerTache(id);
    }

    @GetMapping
    public List<TacheDto> liste() {
        return tacheService.listeTaches();
    }

    @GetMapping("/employe")
    public List<TacheDto> tachesEmploye() {
        return tacheService.tachesParEmploye();
    }

    @PutMapping("/{id}/etat")
    public void updateEtat(@PathVariable Long id, @RequestParam EtatTache etat) {
        tacheService.mettreAJourEtat(id, etat);
    }

    @PutMapping("/{id}/affecter")
    public void affecter(@PathVariable Long id, @RequestBody List<Long> employeIds) {
        tacheService.affecterTacheAEmployes(id, employeIds);
    }
}

