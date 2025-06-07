package tn.ONT.gestion_ONT.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.Inputsoldedto;
import tn.ONT.gestion_ONT.dto.SoldeCongeDto;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.SoldeConge;
import tn.ONT.gestion_ONT.repository.EmployeRepository;
import tn.ONT.gestion_ONT.repository.SoldeCongeRepository;

@Service
@RequiredArgsConstructor
public class SoldeCongeService {

    private final SoldeCongeRepository soldeCongeRepository;
    private final EmployeRepository employeRepository;

    // ✅ Initialiser un solde pour un nouvel employé
    public SoldeCongeDto creerSolde(Inputsoldedto inputsoldedto) {
        Employe employe = employeRepository.findById(inputsoldedto.getEmployeId())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
       Optional<SoldeConge>  soldeexiste = soldeCongeRepository.findByEmployeAndAnnee(employe,inputsoldedto.getAnnee());
               if(soldeexiste.isPresent())
               {
            	   soldeexiste.get().setSoldeDisponible(inputsoldedto.getSoldeInitial());
            	   soldeexiste.get().setSoldePris(0);
            	   return SoldeCongeDto.fromEntity(soldeCongeRepository.save(soldeexiste.get()));
            	   
               }
        SoldeConge solde = SoldeConge.builder()
                .annee(inputsoldedto.getAnnee())
                .soldeDisponible(inputsoldedto.getSoldeInitial())
                .soldePris(0)
                .employe(employe)
                .build();

        return SoldeCongeDto.fromEntity(soldeCongeRepository.save(solde));
    }

    // ✅ Consulter le solde d'un employé pour une année donnée
    public SoldeCongeDto consulterSolde(Long employeId, int annee) {
        SoldeConge solde = soldeCongeRepository.findByEmployeAndAnnee(
                employeRepository.findById(employeId).orElseThrow(), annee)
                .orElseThrow(() -> new RuntimeException("Solde non trouvé"));

        return SoldeCongeDto.fromEntity(solde);
    }

    // ✅ Historique des soldes
    public List<SoldeCongeDto> historiqueSoldes(Long employeId) {
        return soldeCongeRepository.findAllByEmployeId(employeId).stream()
                .map(SoldeCongeDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ Mettre à jour manuellement un solde (admin/RH)
    public SoldeCongeDto modifierSolde(Long soldeId, int nouveauSoldeDisponible) {
        SoldeConge solde = soldeCongeRepository.findById(soldeId)
                .orElseThrow(() -> new RuntimeException("Solde introuvable"));

        solde.setSoldeDisponible(nouveauSoldeDisponible);
        return SoldeCongeDto.fromEntity(soldeCongeRepository.save(solde));
    }
}


