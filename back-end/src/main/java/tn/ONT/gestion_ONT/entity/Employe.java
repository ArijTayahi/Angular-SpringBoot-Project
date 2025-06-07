package tn.ONT.gestion_ONT.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@SuperBuilder

public class Employe extends User{
	
		
	@ManyToOne
	private Service_Centre service_centre;
	
	 @ManyToMany
	 private List<Tache>taches;
	
	 @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
	    private List<SoldeConge> soldes;

	    @OneToMany(mappedBy = "employe")
	    private List<DemandeConge> demandes;


}
