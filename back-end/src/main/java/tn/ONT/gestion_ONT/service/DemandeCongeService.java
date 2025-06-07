package tn.ONT.gestion_ONT.service;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Year;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.ONT.gestion_ONT.dto.DemandeCongeDto;
import tn.ONT.gestion_ONT.entity.DemandeConge;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.JourFerie;
import tn.ONT.gestion_ONT.entity.Service_Centre;
import tn.ONT.gestion_ONT.entity.SoldeConge;
import tn.ONT.gestion_ONT.entity.StatutDemande;
import tn.ONT.gestion_ONT.entity.TypeConge;
import tn.ONT.gestion_ONT.entity.User;
import tn.ONT.gestion_ONT.repository.DemandeCongeRepository;
import tn.ONT.gestion_ONT.repository.EmployeRepository;
import tn.ONT.gestion_ONT.repository.JoursFeriesRepository;
import tn.ONT.gestion_ONT.repository.Service_Centre_Repository;
import tn.ONT.gestion_ONT.repository.SoldeCongeRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeCongeService {
  
   private final DemandeCongeRepository demandeCongeRepository;
   private final EmployeRepository employeRepository;
   private final SoldeCongeRepository soldeCongeRepository;
   private final JourOuvreService jourOuvreService;
   private final JoursFeriesRepository jourFerieRepository;
   private final Service_Centre_Repository serviceCentreRepository;
  
   private static final int DUREE_LEGALE_MATERNITE = 90;
   private static final int NOMBRE_MIN_EMPLOYES = 5;
  
   
   
   //pour recuperer current user connecte
   public User getCurrentUser() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    if (authentication != null && authentication.getPrincipal() instanceof User) {
	        return (User) authentication.getPrincipal(); // si User implémente UserDetails
	    }

	    return null;
	}
   // ✅ Créer une demande de congé
   public DemandeCongeDto creerDemande(DemandeCongeDto dto) {
	Long   employeId= getCurrentUser().getId();
       try {
           // 1. Validation des dates
           validateDates(dto);
           // 2. Récupération de l'employé et vérification
           Employe employe = getEmployeById(employeId);
             
           // 3. Vérification du département
           validateEmployeDepartment(employe);
         
           // 4. ✅ NOUVELLE LOGIQUE - Validation de la période selon les règles métier
           validatePeriodeConge(dto.getDateDebut(), dto.getDateFin());
         
           // 5. Vérification du chevauchement avec d'autres congés
           validateNoOverlappingLeaves(employe, dto);
          
           // 6. Vérification spécifique par type de congé
           validateTypeConge(dto);
         
           // 7. ✅ MODIFIÉE - Vérification du personnel minimum seulement pour les jours ouvrables
           checkDepartmentMinEmpParJourOuvrable(employe.getService_centre(), dto.getDateDebut(), dto.getDateFin());
          
           // 8. Calcul du nombre de jours ouvrés demandés
           int joursOuvresDemandes = jourOuvreService.calcJoursOuvres(dto.getDateDebut(), dto.getDateFin());
         
           // 9. Vérification du solde pour les congés payés
           if (dto.getType() == TypeConge.PAYE) {
               validateSoldeConge(employe, joursOuvresDemandes);
           }
         
           // 10. Validation durée légale pour congé maternité
          
          
           // 11. Création de la demande
           DemandeConge demande = createDemandeConge(dto, employe, joursOuvresDemandes);
          
           return DemandeCongeDto.fromEntity(demandeCongeRepository.save(demande));
          
       } catch (Exception e) {
           log.error("Error creating leave request for employee {}: {}", employeId, e.getMessage(), e);
           throw e;
       }
   }
  
   // Helper methods for better code organization
   private void validateDates(DemandeCongeDto dto) {
       if (dto.getDateDebut().after(dto.getDateFin())) {
           throw new IllegalArgumentException("La date de début doit être antérieure à la date de fin");
       }
     
       if (dto.getDateDebut().before(new Date())) {
           throw new IllegalArgumentException("La date de début ne peut pas être dans le passé");
       }
   }
  
   private Employe getEmployeById(Long employeId) {
       return employeRepository.findById(employeId)
               .orElseThrow(() -> new EntityNotFoundException("Employé introuvable"));
   }
  
   private void validateEmployeDepartment(Employe employe) {
       if (employe.getService_centre() == null) {
           throw new IllegalStateException("L'employé doit être rattaché à un département");
       }
   }
  
   // ✅ NOUVELLE MÉTHODE - Validation de la période selon les règles métier
   private void validatePeriodeConge(Date dateDebut, Date dateFin) {
       LocalDate dateDebutLocal = dateDebut.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
       LocalDate dateFinLocal = dateFin.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
       
       // Vérifier si c'est une demande d'un seul jour
       boolean estUnSeulJour = dateDebutLocal.equals(dateFinLocal);
       
       if (estUnSeulJour) {
           // Pour un seul jour, il ne doit PAS être weekend ou jour férié
           if (jourOuvreService.estWeekend(dateDebut)) {
               throw new IllegalArgumentException("Vous ne pouvez pas demander un congé pour un seul jour de weekend");
           }
           
           if (jourOuvreService.estJourFerie(dateDebut)) {
               throw new IllegalArgumentException("Vous ne pouvez pas demander un congé pour un seul jour férié");
           }
       }
       
       // Pour les périodes de plusieurs jours, vérifier qu'il y a au moins un jour ouvrable
       int joursOuvrables = jourOuvreService.calcJoursOuvres(dateDebut, dateFin);
       if (joursOuvrables == 0) {
           throw new IllegalArgumentException("La période demandée ne contient aucun jour ouvrable");
       }
   }
  
   private void validateNoOverlappingLeaves(Employe employe, DemandeCongeDto dto) {
       boolean existeConflit = demandeCongeRepository.existsByEmployeAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(
               employe, dto.getDateFin(), dto.getDateDebut());
       if (existeConflit) {
           throw new IllegalStateException("Une demande de congé chevauche déjà ces dates.");
       }
   }
  
   private void validateSoldeConge(Employe employe, int joursOuvresDemandes) {
       SoldeConge solde = soldeCongeRepository.findByEmployeAndAnnee(employe, Year.now().getValue())
           .orElseThrow(() -> new EntityNotFoundException("Aucun solde disponible pour l'année en cours"));
     
       if (solde.getSoldeDisponible() == 0) {
           throw new IllegalStateException("Votre solde de congés est épuisé pour cette année.");
       }
     
       if (solde.getSoldeDisponible() < joursOuvresDemandes) {
           throw new IllegalStateException("Vous n'avez pas assez de jours de congé disponibles. " +
               "Jours demandés : " + joursOuvresDemandes + ", Solde disponible : " + solde.getSoldeDisponible());
       }
   }
  
   private void validateMaternityLeaveDuration(int joursOuvresDemandes) {
       if (joursOuvresDemandes != DUREE_LEGALE_MATERNITE) {
           throw new IllegalArgumentException("Le congé maternité doit durer exactement " +
                   DUREE_LEGALE_MATERNITE + " jours ouvrés (hors weekends et jours fériés)");
       }
   }
  
   private DemandeConge createDemandeConge(DemandeCongeDto dto, Employe employe, int joursOuvresDemandes) {
       return DemandeConge.builder()
               .dateDebut(dto.getDateDebut())
               .dateFin(dto.getDateFin())
               .statut(StatutDemande.EN_ATTENTE)
               .type(TypeConge.ANNUEL)
               .employe(employe)
               .nombreJoursOuvres(joursOuvresDemandes)
               .build();
   }
   
 
   // Rest of the methods remain the same...
   public DemandeCongeDto validerDemande(Long demandeId, boolean approuve) {
       DemandeConge demande = demandeCongeRepository.findById(demandeId)
               .orElseThrow(() -> new EntityNotFoundException("Demande introuvable"));
      
       if (!approuve) {
           demande.setStatut(StatutDemande.REJETEE);
       } else {
           int joursOuvresDemandes = jourOuvreService.calcJoursOuvres(demande.getDateDebut(), demande.getDateFin());
          
       
         if (demande.getType() == TypeConge.ANNUEL) {
      
               SoldeConge solde = soldeCongeRepository.findByEmployeAndAnnee(
                       demande.getEmploye(), Year.now().getValue())
                       .orElseThrow(() -> new EntityNotFoundException("Solde non trouvé pour l'année"));  
         
              
               if (solde.getSoldeDisponible() < joursOuvresDemandes) {
                   throw new IllegalStateException("Solde insuffisant.");
               }
              
               solde.setSoldeDisponible(solde.getSoldeDisponible() - joursOuvresDemandes);
               solde.setSoldePris(solde.getSoldePris() + joursOuvresDemandes);
               soldeCongeRepository.save(solde);
           }
         
           demande.setStatut(StatutDemande.VALIDEE);
       }
       return DemandeCongeDto.fromEntity(demandeCongeRepository.save(demande));
   }
  
   public List<DemandeCongeDto> historiqueConges() {
	   
		Long   employeid= getCurrentUser().getId();
		try {
       return demandeCongeRepository.findAllByEmployeId(employeid).stream()
               .map(DemandeCongeDto::fromEntity)
               .collect(Collectors.toList());
	    } catch (Exception e) {
	           log.error("Error creating leave request for employee {}: {}", employeid, e.getMessage(), e);
	           throw e;
	       }
       
   }
  
   public List<DemandeCongeDto> toutesLesDemandes() {
       return demandeCongeRepository.findAll().stream()
               .map(DemandeCongeDto::fromEntity)
               .collect(Collectors.toList());
   }
  
   public void supprimerDemande(Long id) {
       DemandeConge demande = demandeCongeRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
       if (demande.getStatut() != StatutDemande.EN_ATTENTE) {
           throw new IllegalStateException("Seules les demandes en attente peuvent être supprimées.");
       }
       demandeCongeRepository.delete(demande);
   }
 
   private Set<LocalDate> getJoursFeriesPourPeriode(Date dateDebut, Date dateFin) {
       List<JourFerie> joursFeriesList = jourFerieRepository.findByPeriode(dateDebut, dateFin);
     
       return joursFeriesList.stream()
               .map(JourFerie::getDate)
               .map(date -> date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate())
               .collect(Collectors.toSet());
   }
	   
   // ✅ Validation par type de congé
   private void validateTypeConge(DemandeCongeDto dto) {
       switch (dto.getType()) {
           case MALADIE:
              
           case MATERNITE:
              
           case FORMATION:
           case EXCEPTIONNEL:
                     default:
               // Pas de validation spécifique pour les autres types
               break;
       }
   }
	   
   // ✅ MÉTHODE CORRIGÉE - Vérification du nombre minimum d'employés SEULEMENT pour les jours ouvrables
   private void checkDepartmentMinEmpParJourOuvrable(Service_Centre serviceCentre, Date dateDebut, Date dateFin) {
       Calendar cal = Calendar.getInstance();
       cal.setTime(dateDebut);
       
       while (!cal.getTime().after(dateFin)) {
           Date dateDuJour = cal.getTime();
           
           // ✅ CONDITION MODIFIÉE - Vérifier seulement les jours ouvrables (ni weekend, ni férié)
           if (jourOuvreService.estJourOuvrable(dateDuJour)) {
               // Compter les employés présents ce jour-là
               long nbPresents = employeRepository.countByServiceAndDateNotEnConge(serviceCentre, dateDuJour);
               
               if (nbPresents < NOMBRE_MIN_EMPLOYES) {
                   SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                   throw new IllegalStateException(
                       "Il doit rester au moins " + NOMBRE_MIN_EMPLOYES +
                       " employés le " + sdf.format(dateDuJour) +
                       " (jour ouvrable). Actuellement : " + nbPresents + " employé(s) présent(s)."
                   );
               }
           }
           // ✅ Pour les weekends et jours fériés, pas de vérification du minimum d'employés
           
           cal.add(Calendar.DAY_OF_MONTH, 1);
       }
   }
   public DemandeCongeDto modifierDemande(Long demandeId, DemandeCongeDto dto) {
	    DemandeConge demande = demandeCongeRepository.findById(demandeId)
	        .orElseThrow(() -> new EntityNotFoundException("Demande de congé non trouvée"));

	    // Vérifier que la demande est encore modifiable
	    if (demande.getStatut() != StatutDemande.EN_ATTENTE) {
	        throw new IllegalStateException("Seules les demandes en attente peuvent être modifiées");
	    }

	    // Vérification des dates
	    validateDates(dto);

	    // Vérification de la période
	   validatePeriodeConge(dto.getDateDebut(), dto.getDateFin());

	    // Vérification de chevauchement
	   // validateNoOverlappingLeaves(demande.getEmploye(), dto);

	    // Recalcul des jours ouvrés
	    int joursOuvresDemandes = jourOuvreService.calcJoursOuvres(dto.getDateDebut(), dto.getDateFin());

	    // Vérification de solde si congé payé
	    if (dto.getType() == TypeConge.PAYE) {
	        validateSoldeConge(demande.getEmploye(), joursOuvresDemandes);
	    }

	    // Mise à jour des champs
	    demande.setDateDebut(dto.getDateDebut());
	    demande.setDateFin(dto.getDateFin());
	    demande.setType(dto.getType());
	    demande.setNombreJoursOuvres(joursOuvresDemandes);

	    return DemandeCongeDto.fromEntity(demandeCongeRepository.save(demande));
	}

}