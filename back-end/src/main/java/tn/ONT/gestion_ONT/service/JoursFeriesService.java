package tn.ONT.gestion_ONT.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.entity.JourFerie;
import tn.ONT.gestion_ONT.entity.TypeJourFerie;
import tn.ONT.gestion_ONT.repository.JoursFeriesRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class JoursFeriesService {
  
    private final JoursFeriesRepository jourFeriesRepository;
  
    @EventListener(ApplicationReadyEvent.class)
    public void initialiserJoursFeriesFixesTunisiens() {
        int anneeActuelle = Year.now().getValue();
        creerJoursFeriesFixes(anneeActuelle);
        creerJoursFeriesFixes(anneeActuelle + 1);
    }
  
    private void creerJoursFeriesFixes(int annee) {
        Map<String, String> joursFeriesFixesTunisie = Map.of(
            "01-01", "Nouvel An",
            "01-14", "Fête de la Révolution et de la Jeunesse",
            "03-20", "Fête de l'Indépendance",
            "04-09", "Journée des Martyrs",
            "05-01", "Fête du Travail",
            "07-25", "Fête de la République",
            "08-13", "Journée de la Femme",
            "10-15", "Journée de l'Évacuation"
        );
      
        joursFeriesFixesTunisie.forEach((date, nom) -> {
            if (!jourFeriesRepository.existsByNomAndAnnee(nom, annee)) {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
                    Date dateComplete = sdf.parse(date + "-" + annee);
                  
                    JourFerie jourFerie = JourFerie.builder()
                            .date(dateComplete)
                            .nom(nom)
                            .description("Jour férié national tunisien")
                            .type(TypeJourFerie.NATIONAL_FIXE)
                            .annee(annee)
                            .estRecurrent(true)
                            .estVariable(false)
                            .creePar("SYSTEM")
                            .dateCreation(new Date())
                            .build();
                  
                    jourFeriesRepository.save(jourFerie);
                } catch (ParseException e) {
                    // Log error properly in production
                    System.err.println("Error parsing date: " + date + "-" + annee);
                }
            }
        });
    }
  
    public JourFerie ajouterJourFerieIslamique(String nom, Date date, String description, String creePar) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int annee = cal.get(Calendar.YEAR);
      
        if (jourFeriesRepository.existsByNomAndAnnee(nom, annee)) {
            throw new IllegalStateException("Ce jour férié existe déjà pour cette année");
        }
      
        JourFerie jourFerie = JourFerie.builder()
                .date(date)
                .nom(nom)
                .description(description)
                .type(TypeJourFerie.RELIGIEUX_ISLAMIQUE)
                .annee(annee)
                .estRecurrent(false)
                .estVariable(true)
                .creePar(creePar)
                .dateCreation(new Date())
                .build();
      
        return jourFeriesRepository.save(jourFerie);
    }
  
    public List<JourFerie> getJoursFeriesAnnee(int annee) {
        return jourFeriesRepository.findByAnneeOrderByDate(annee);
    }
  
    public void supprimerJourFerie(Long id, String utilisateur) {
        JourFerie jourFerie = jourFeriesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Jour férié introuvable"));
      
        if (!jourFerie.isEstVariable()) {
            throw new IllegalStateException("Seuls les jours fériés variables peuvent être supprimés");
        }
      
        jourFeriesRepository.delete(jourFerie);
    }
  
    public void creerJoursFeriesIslamiques(int annee, Map<String, Date> datesFeriesIslamiques, String creePar) {
        Map<String, String> nomsArabes = Map.of(
            "Aid Al Fitr", "Aïd El Fitr - Fin du Ramadan",
            "Aid Al Adha", "Aïd El Adha - Fête du Sacrifice",
            "Mawlid", "Mawlid Ennabaoui - Naissance du Prophète",
            "Muharram", "Ras Essana Hijriya - Nouvel An Islamique",
            "Achoura", "Achoura"
        );
      
        datesFeriesIslamiques.forEach((nom, date) -> {
            if (!jourFeriesRepository.existsByNomAndAnnee(nom, annee)) {
                JourFerie jourFerie = JourFerie.builder()
                        .date(date)
                        .nom(nom)
                        .description(nomsArabes.getOrDefault(nom, "Fête religieuse islamique"))
                        .type(TypeJourFerie.RELIGIEUX_ISLAMIQUE)
                        .annee(annee)
                        .estRecurrent(true)
                        .estVariable(true)
                        .creePar(creePar)
                        .dateCreation(new Date())
                        .build();
              
                jourFeriesRepository.save(jourFerie);
            }
        });
    }
}