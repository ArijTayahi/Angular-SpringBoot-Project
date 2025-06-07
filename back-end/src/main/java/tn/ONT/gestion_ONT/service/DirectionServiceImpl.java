package tn.ONT.gestion_ONT.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.DirectionDto;
import tn.ONT.gestion_ONT.entity.Direction;
import tn.ONT.gestion_ONT.repository.DirectionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DirectionServiceImpl implements DirectionService {

    private final DirectionRepository directionRepository;  // Assuming you have a repository for Direction

    @Override
    public void deleteById(Long id) {
        directionRepository.deleteById(id);
    }

    @Override
    public DirectionDto createDirection(DirectionDto directionDto) {
    	Direction direction = DirectionDto.toEntity(directionDto);
    	Direction directionSaved = directionRepository.save(direction);
        return DirectionDto.fromEntity(directionSaved) ;
    }

    @Override
    public DirectionDto updateDirection(DirectionDto directionDto) {
        // Find existing direction by ID
        Direction direction = directionRepository.findById(directionDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Direction not found"));

        // Update fields
        direction.setTitre(directionDto.getTitre());
        // Update other fields as needed

        // Save updated entity
        direction = directionRepository.save(direction);

        // Convert and return the updated DirectionDto
        return new DirectionDto(direction.getId(), direction.getTitre());
    }

    @Override
    public DirectionDto findById(Long id) {
        Direction direction = directionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Direction not found"));

        return new DirectionDto(direction.getId(), direction.getTitre());
    }

    @Override
    public List<DirectionDto> allDirection() {
        List<Direction> directions = directionRepository.findAll();
        return directions.stream()
                .map(direction -> new DirectionDto(direction.getId(), direction.getTitre()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DirectionDto> chercherDirection(String titre) {
        List<Direction> directions = directionRepository.findByTitreContaining(titre);
        return directions.stream()
                .map(direction -> new DirectionDto(direction.getId(), direction.getTitre()))
                .collect(Collectors.toList());
    }
}

