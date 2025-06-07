package tn.ONT.gestion_ONT.service;

import java.util.List;

import tn.ONT.gestion_ONT.dto.DirectionDto;

public interface DirectionService {

	void deleteById (Long id);
	DirectionDto createDirection(DirectionDto directionDto);
	DirectionDto updateDirection(DirectionDto directionDto);
	DirectionDto findById(Long id);
	List<DirectionDto> allDirection();
	List<DirectionDto> chercherDirection(String titre);


}
