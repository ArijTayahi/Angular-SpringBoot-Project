package tn.ONT.gestion_ONT.dto;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.Grade;
import tn.ONT.gestion_ONT.modeleSecurité.Register_Request;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class EmployeDto extends Register_Request{

	public boolean isEmploye;
	
public static Employe toEntity(EmployeDto request) {
		
		return 	Employe.builder()
				//.id(request.getId())
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
	
	public static EmployeDto fromEntity(Employe request) {
		
		return EmployeDto.builder()
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
