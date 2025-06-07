package tn.ONT.gestion_ONT.modeleSecurité;

import java.util.Date;
import java.util.List;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import tn.ONT.gestion_ONT.entity.Grade;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder

public class Register_Request {

	private Long id;
	private String nom;
	private String prenom;
	private String password;
	private String tlf;
	private int matricule;
	private Grade grade;
	private String adresse;
	private String email;
	private String avatar;
	private Date dateNais;
	//private List<String> roles;
	private Long id_service_centre;
	
	
	
}
