package tn.ONT.gestion_ONT.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.Direction;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DirectionDto{

	private Long id;
	private String titre;
	
    public static Direction toEntity(DirectionDto request) {
        return  Direction.builder()
                .titre(request.getTitre())
                .build();
    }

    public static DirectionDto fromEntity(Direction request) {
        return DirectionDto.builder()
        		 .id(request.getId())
                 .titre(request.getTitre())
                 .build();
    }
}

