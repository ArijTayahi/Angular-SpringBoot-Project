package tn.ONT.gestion_ONT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.ONT.gestion_ONT.entity.Direction;

public interface DirectionRepository extends JpaRepository<Direction, Long> {

	 List<Direction> findByTitreContaining(String titre);
	
}
