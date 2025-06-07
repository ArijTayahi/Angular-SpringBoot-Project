package tn.ONT.gestion_ONT.dto;

import java.util.Calendar;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.DemandeConge;
import tn.ONT.gestion_ONT.entity.StatutDemande;
import tn.ONT.gestion_ONT.entity.TypeConge;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandeCongeDto {

	 private Long id;
	 @JsonFormat(pattern = "yyyy-MM-dd")
	    private Date dateDebut;
	 @JsonFormat(pattern = "yyyy-MM-dd")
	    private Date dateFin;
	    private TypeConge type;
	   // private String pieceJustificative;
	    private StatutDemande statut;
	    
	    
	 // Validation des dates avec Bean Validation
	    @AssertTrue(message = "La date de début doit être antérieure à la date de fin")
	    public boolean isDateDebutBeforeDateFin() {
	        return dateDebut == null || dateFin == null || !dateDebut.after(dateFin);
	    }
	    
	    // Vérification des weekends
	    @AssertTrue(message = "Les dates incluent des weekends. Veuillez sélectionner uniquement des jours ouvrés.")
	    public boolean isWorkingDaysOnly() {
	        if (dateDebut == null || dateFin == null) return true;
	        
	        Calendar cal = Calendar.getInstance();
	        cal.setTime(dateDebut);
	        
	        while (!cal.getTime().after(dateFin)) {
	            int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
	            if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
	                return false;
	            }
	            cal.add(Calendar.DAY_OF_MONTH, 1);
	        }
	        
	        return true;
	    }
	    
	    public static DemandeConge toEntity(DemandeCongeDto request) {
	        return DemandeConge.builder()
	                .dateDebut(request.getDateDebut())
	                .dateFin(request.getDateFin())
	                .type(request.getType())
	               // .pieceJustificative(request.getPieceJustificative())
	                .statut(request.getStatut() != null ? request.getStatut() : StatutDemande.EN_ATTENTE)
	                .build();
	    }

	    public static DemandeCongeDto fromEntity(DemandeConge request) {
	        return DemandeCongeDto.builder()
	                .id(request.getId())
	                .dateDebut(request.getDateDebut())
	                .dateFin(request.getDateFin())
	                .type(request.getType())
	               // .pieceJustificative(request.getPieceJustificative())
	                .statut(request.getStatut())
	                .build();
	    }
}
