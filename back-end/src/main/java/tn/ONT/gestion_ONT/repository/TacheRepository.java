package tn.ONT.gestion_ONT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.ONT.gestion_ONT.entity.Tache;

public interface TacheRepository extends JpaRepository<Tache,Long> {

	 List<Tache> findByTitreContaining(String titre);
	    List<Tache> findByEmployessId(Long idEmploye);
}
