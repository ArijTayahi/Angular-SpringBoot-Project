package tn.ONT.gestion_ONT.service;

import java.util.List;

import tn.ONT.gestion_ONT.dto.TacheDto;
import tn.ONT.gestion_ONT.dto.Tachesempdto;
import tn.ONT.gestion_ONT.entity.EtatTache;

public interface TacheService {
   
	     TacheDto creerTache(Tachesempdto dto );
	    TacheDto modifierTache(Long id, TacheDto dto);
	    void supprimerTache(Long id);
	    List<TacheDto> listeTaches();
	    TacheDto chercherParId(Long id);
	    void affecterTacheAEmployes(Long tacheId, List<Long> employeIds);
	    void mettreAJourEtat(Long tacheId, EtatTache etat);
	    List<TacheDto> tachesParEmploye();
}
