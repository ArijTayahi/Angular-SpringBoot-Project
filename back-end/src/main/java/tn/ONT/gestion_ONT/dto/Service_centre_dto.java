package tn.ONT.gestion_ONT.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.Direction;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.Service_Centre;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Service_centre_dto {
	
	private Long id;
	private String titre;
	private Long id_direction;
	
	  public static Service_Centre toEntity(Service_centre_dto  request) {
	        return  Service_Centre.builder()
	        		//.id(request.getId())
	                .titre(request.getTitre())
	                .build();
	    }

	    public static Service_centre_dto fromEntity(Service_Centre  request) {
	        return Service_centre_dto.builder()
	        		 .id(request.getId())
	                 .titre(request.getTitre())
	                 .build();
	    }
	

}
