package tn.ONT.gestion_ONT.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.Cadre_Directeur;
import tn.ONT.gestion_ONT.entity.User;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfilUserDto  {

	
	private Long id;
	private String nom;
	private String prenom;
	private String tlf;
	private String adresse;
	private String email;
	private String avatar;
	
public static User toEntity(ProfilUserDto request) {
		
		return 	Cadre_Directeur.builder()
				.id(request.getId())
				.nom(request.getNom())
				.prenom(request.getPrenom())
				.tlf(request.getTlf())
				.adresse(request.getAdresse())
				.email(request.getEmail())
				.avatar(request.getAvatar())
				.build();

	};
	
	public static ProfilUserDto fromEntity(User request) {
		
		return ProfilUserDto.builder()
				.id(request.getId())
				.nom(request.getNom())
				.prenom(request.getPrenom())
				.tlf(request.getTlf())
				.adresse(request.getAdresse())
				.email(request.getEmail())
				.avatar(request.getAvatar())
				.build();
		
	};
}
	

