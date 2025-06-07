package tn.ONT.gestion_ONT.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Tache {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	  private String titre;
	    private String description;
	    private LocalDate dateEcheance;

	    @Enumerated(EnumType.STRING)
	    private EtatTache etatTache = EtatTache.EN_ATTENTE;
	
	@ManyToMany(mappedBy = "taches")
	private List<Employe>employess;
}
