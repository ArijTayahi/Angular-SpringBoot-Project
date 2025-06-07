package tn.ONT.gestion_ONT.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import tn.ONT.gestion_ONT.entity.Cadre_Directeur;
import tn.ONT.gestion_ONT.modeleSecurité.Register_Request;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder

public class CadreDirecteurDto extends Register_Request {

	private Long idDirection;
	
public static Cadre_Directeur toEntity(CadreDirecteurDto request) {
		
		return 	Cadre_Directeur.builder()
				//.id(request.getId())
				.nom(request.getNom())
				.prenom(request.getPrenom())
				
				.password(request.getPassword())
				.tlf(request.getTlf())
				.adresse(request.getAdresse())
				.email(request.getEmail())
				.avatar(request.getAvatar())
				.matricule(request.getMatricule())
				.grade(request.getGrade())
				.dateNais(request.getDateNais())

				.build();

	};
	
	public static CadreDirecteurDto fromEntity(Cadre_Directeur request) {
		
		return CadreDirecteurDto.builder()
				.id(request.getId())
				.nom(request.getNom())
				.prenom(request.getPrenom())
				.password(request.getPassword())
				.tlf(request.getTlf())
				.adresse(request.getAdresse())
				.email(request.getEmail())
				.avatar(request.getAvatar())
				.matricule(request.getMatricule())
				.dateNais(request.getDateNais())

				.grade(request.getGrade())
				.build();
		
	};
}
