package tn.ONT.gestion_ONT.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.Service_Centre;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListeServicecentredto {
	private Long id;
	private String titre;
	private DirectionDto directionDto;
	
	    public static ListeServicecentredto fromEntity(Service_Centre  request) {
	        return ListeServicecentredto.builder()
	        		 .id(request.getId())
	                 .titre(request.getTitre())
	                 .directionDto(DirectionDto.fromEntity(request.getDirection()))
	                 .build();
	    }

}
