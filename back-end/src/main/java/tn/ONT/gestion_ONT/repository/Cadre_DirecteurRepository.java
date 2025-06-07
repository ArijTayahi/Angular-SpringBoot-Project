package tn.ONT.gestion_ONT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.ONT.gestion_ONT.entity.Cadre_Directeur;

public interface Cadre_DirecteurRepository extends JpaRepository <Cadre_Directeur, Long> {

	List<Cadre_Directeur> findByNomContaining(String nom);

}
