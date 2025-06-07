package tn.ONT.gestion_ONT.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.entity.JourFerie;
import tn.ONT.gestion_ONT.repository.JoursFeriesRepository;

@Service
@RequiredArgsConstructor
public class JourOuvreService {
    
    private final JoursFeriesRepository jourFerieRepository;
    
    // Vérifier si une date est un weekend
    public boolean estWeekend(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        return dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY;
    }
    
    // ✅ NOUVELLE METHOD - Vérifier si une date est un jour férié
    public boolean estJourFerie(Date date) {
        return jourFerieRepository.existsByDate(date);
    }
    
    // ✅ NOUVELLE METHOD - Vérifier si une date est un jour ouvrable
    public boolean estJourOuvrable(Date date) {
        return !estWeekend(date) && !estJourFerie(date);
    }
    
    // ✅ MÉTHODE AMÉLIORÉE - Calculer les jours ouvrés (excluant weekends ET jours fériés)
    public int calcJoursOuvres(Date dateDebut, Date dateFin) {
        int joursOuvres = 0;
        Calendar cal = Calendar.getInstance();
        cal.setTime(dateDebut);
        
        while (!cal.getTime().after(dateFin)) {
            Date dateCourante = cal.getTime();
            
            // Compter seulement si c'est un jour ouvrable (ni weekend ni férié)
            if (estJourOuvrable(dateCourante)) {
                joursOuvres++;
            }
            
            cal.add(Calendar.DAY_OF_MONTH, 1);
        }
        return joursOuvres;
    }
    
    // ✅ NOUVELLE METHOD - Obtenir les jours fériés dans une période
    public List<JourFerie> getJoursFeriesDansPeriode(Date dateDebut, Date dateFin) {
        return jourFerieRepository.findByPeriode(dateDebut, dateFin);
    }
    
    // ✅ NOUVELLE METHOD - Calculer jours ouvrés avec détail des jours fériés
    public Map<String, Object> calcJoursOuvresDetaille(Date dateDebut, Date dateFin) {
        int joursOuvres = 0;
        int weekends = 0;
        int joursFeries = 0;
        List<Date> datesFeries = new ArrayList<>();
        
        Calendar cal = Calendar.getInstance();
        cal.setTime(dateDebut);
        
        while (!cal.getTime().after(dateFin)) {
            Date dateCourante = cal.getTime();
            
            if (estWeekend(dateCourante)) {
                weekends++;
            } else if (estJourFerie(dateCourante)) {
                joursFeries++;
                datesFeries.add(new Date(dateCourante.getTime()));
            } else {
                joursOuvres++;
            }
            
            cal.add(Calendar.DAY_OF_MONTH, 1);
        }
        
        Map<String, Object> resultat = new HashMap<>();
        resultat.put("joursOuvres", joursOuvres);
        resultat.put("weekends", weekends);
        resultat.put("joursFeries", joursFeries);
        resultat.put("datesFeries", datesFeries);
        
        return resultat;
    }
}