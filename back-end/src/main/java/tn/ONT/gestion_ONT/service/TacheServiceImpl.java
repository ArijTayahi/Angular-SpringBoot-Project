package tn.ONT.gestion_ONT.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.TacheDto;
import tn.ONT.gestion_ONT.dto.Tachesempdto;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.EtatTache;
import tn.ONT.gestion_ONT.entity.Notification;
import tn.ONT.gestion_ONT.entity.NotificationStatus;
import tn.ONT.gestion_ONT.entity.Tache;
import tn.ONT.gestion_ONT.entity.User;
import tn.ONT.gestion_ONT.repository.EmployeRepository;
import tn.ONT.gestion_ONT.repository.TacheRepository;

@Service
@RequiredArgsConstructor
public class TacheServiceImpl implements TacheService {

    private final TacheRepository tacheRepo;
    private final EmployeRepository employeRepo;
    private final NotificationService notificationService;


   /* @Override
    public TacheDto creerTache(Tachesempdto dto ) {
    	  Tache tache=new Tache();
        List<Employe> employes = employeRepo.findAllById(dto.getIdEmps());
        tache.setTitre(dto.getTache().getTitre());
        tache.setDateEcheance(dto.getTache().getDateEcheance());
        tache.setDescription(dto.getTache().getDescription());
        tache.setEtatTache(EtatTache.EN_ATTENTE);
        tache.setEmployess(employes);
        return TacheDto.fromEntity(tacheRepo.save(tache));
    }*/
    public User getCurrentUser() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    if (authentication != null && authentication.getPrincipal() instanceof User) {
	        return (User) authentication.getPrincipal(); // si User implémente UserDetails
	    }

	    return null;
	}
    @Override
    public TacheDto creerTache(Tachesempdto dto) {
        // Validation des données d'entrée
        if (dto == null || dto.getTache() == null) {
            throw new IllegalArgumentException("Les données de la tâche ne peuvent pas être nulles");
        }

        // Vérification des employés
        if (dto.getIdEmps() == null || dto.getIdEmps().isEmpty()) {
            throw new IllegalArgumentException("Au moins un employé doit être assigné à la tâche");
        }

        // Récupération des employés
        List<Employe> employes = employeRepo.findAllById(dto.getIdEmps());
        if (employes.size() != dto.getIdEmps().size()) {
            throw new EntityNotFoundException("Un ou plusieurs employés n'ont pas été trouvés");
        }

        // Création de la tâche
        Tache tache = new Tache();
        tache.setTitre(dto.getTache().getTitre());
        tache.setDescription(dto.getTache().getDescription());
        tache.setDateEcheance(dto.getTache().getDateEcheance());
        tache.setEtatTache(EtatTache.EN_ATTENTE);
        
        // Gestion bidirectionnelle de la relation
        tache.setEmployess(employes);
        for (Employe employe : employes) {
            employe.getTaches().add(tache);
        }

        // Sauvegarde
        Tache savedTache = tacheRepo.save(tache);
        
        // Mise à jour des employés (si nécessaire selon votre configuration de cascade)
        employeRepo.saveAll(employes);
        
     // Notifier tous les employés affectés
//        notificationService.sendNotificationToMultipleUsers(
//            employes.stream().map(emp -> emp.getId()).toList(),
//            "Nouvelle tâche assignée : " + tache.getTitre()
//        );
        
        
        notificationService.sendNotificationToMultipleUsers(
        	    employes.stream().map(emp -> emp.getId()).toList(),
        	    Notification.builder()
        	        .status(NotificationStatus.BORROWED)
        	        .message("Your book has been borrowed")
        	        .bookTitle(tache.getTitre())
        	        .build()
        	);

        return TacheDto.fromEntity(savedTache);
    }

    @Override
    public TacheDto modifierTache(Long id, TacheDto dto) {
        Tache tache = tacheRepo.findById(id).orElseThrow();
        tache.setTitre(dto.getTitre());
        tache.setDescription(dto.getDescription());
        tache.setDateEcheance(dto.getDateEcheance());
        tache.setEtatTache(dto.getEtatTache());
        return TacheDto.fromEntity(tacheRepo.save(tache));
    }

    @Override
    public void supprimerTache(Long id) {
        tacheRepo.deleteById(id);
    }

    @Override
    public List<TacheDto> listeTaches() {
        return tacheRepo.findAll().stream().map(TacheDto::fromEntity).toList();
    }

    @Override
    public TacheDto chercherParId(Long id) {
        return tacheRepo.findById(id).map(TacheDto::fromEntity).orElse(null);
    }

    @Override
    public void affecterTacheAEmployes(Long tacheId, List<Long> employeIds) {
        Tache tache = tacheRepo.findById(tacheId).orElseThrow();
        List<Employe> employes = employeRepo.findAllById(employeIds);
        tache.setEmployess(employes);
        tacheRepo.save(tache);
    }

    @Override
    public void mettreAJourEtat(Long tacheId, EtatTache etat) {
        Tache tache = tacheRepo.findById(tacheId).orElseThrow();
        tache.setEtatTache(etat);
        tacheRepo.save(tache);
        
     // Notification aux employés liés à la tâche
        List<Long> userIds = tache.getEmployess().stream()
            .map(Employe::getId)
            .toList();
//        notificationService.sendNotificationToMultipleUsers(userIds,
//            "L'état de la tâche \"" + tache.getTitre() + "\" a été mis à jour à : " + etat);
    }

    @Override
    public List<TacheDto> tachesParEmploye() {
    	Long idEmploye = getCurrentUser().getId();
        return tacheRepo.findByEmployessId(idEmploye).stream().map(TacheDto::fromEntity).toList();
    }
}
