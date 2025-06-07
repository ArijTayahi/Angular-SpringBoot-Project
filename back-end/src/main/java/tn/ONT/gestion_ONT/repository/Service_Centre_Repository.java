package tn.ONT.gestion_ONT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.ONT.gestion_ONT.entity.Service_Centre;

public interface Service_Centre_Repository extends JpaRepository<Service_Centre,Long>{

	
	List<Service_Centre> findByTitreContainingIgnoreCase(String titre);
}
