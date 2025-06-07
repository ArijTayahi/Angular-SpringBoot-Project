package tn.ONT.gestion_ONT.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import tn.ONT.gestion_ONT.entity.SoldeConge;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SoldeCongeDto {

    private Long id;
    private int soldeDisponible;
    private int soldePris;
    private int annee;
    
    public static SoldeConge toEntity(SoldeCongeDto request) {
        return SoldeConge.builder()
        	.soldeDisponible(request.getSoldeDisponible())
        	.soldePris(request.getSoldePris())
        	.annee(request.getAnnee())
        		.build();
    }

    public static SoldeCongeDto fromEntity(SoldeConge request) {
        return SoldeCongeDto.builder()
        		 .id(request.getId())
        		 .soldeDisponible(request.getSoldeDisponible())
             	.soldePris(request.getSoldePris())
             	.annee(request.getAnnee())
             		.build();
	              
    }
    
}
