package tn.ONT.gestion_ONT.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.ListeServicecentredto;
import tn.ONT.gestion_ONT.dto.Service_centre_dto;
import tn.ONT.gestion_ONT.entity.Direction;
import tn.ONT.gestion_ONT.entity.Service_Centre;
import tn.ONT.gestion_ONT.repository.DirectionRepository;
import tn.ONT.gestion_ONT.repository.Service_Centre_Repository;

@Service
@Transactional
@RequiredArgsConstructor

public class Service_Centre_ServiceImpl implements Service_Centre_Service {

	
    private final Service_Centre_Repository serviceCentreRepository;
    private final DirectionRepository direction_Repository ;
    @Override
    public void deleteById(Long id) {
        // Vérification de l'existence avant suppression
        if (!serviceCentreRepository.existsById(id)) {
            throw new EntityNotFoundException("Service Centre non trouvé avec l'ID : " + id);
        }
        serviceCentreRepository.deleteById(id);
    }

    @Override
    public Service_centre_dto createServices_Centres(Service_centre_dto serviceCentreDto) {
        // Validation des données d'entrée
        if (serviceCentreDto == null) {
            throw new IllegalArgumentException("Le DTO du service centre ne peut pas être null");
        }
        
        Optional<Direction> OptionalDirection = direction_Repository.findById(serviceCentreDto.getId_direction());
        OptionalDirection.orElseThrow(() -> new RuntimeException("Direction not found with id: " + serviceCentreDto.getId_direction()));
        
        // Conversion DTO -> Entity
        Service_Centre entity = Service_centre_dto.toEntity(serviceCentreDto);
        entity.setDirection(OptionalDirection.get());
        // Sauvegarde
        Service_Centre savedEntity = serviceCentreRepository.save(entity);

        // Conversion Entity -> DTO et retour
        return Service_centre_dto.fromEntity(savedEntity);
    }

    @Override
    public Service_centre_dto updateServices_Centres(Service_centre_dto serviceCentreDto) {
        // Validation des données d'entrée
        if (serviceCentreDto == null || serviceCentreDto.getId() == null) {
            throw new IllegalArgumentException("Le DTO ou l'ID du service centre ne peut pas être null");
        }

        Optional<Service_Centre> Optionalservicentre = serviceCentreRepository.findById(serviceCentreDto.getId());
        Optionalservicentre.orElseThrow(() -> new RuntimeException("service  not found with id: " + serviceCentreDto.getId()));
        
       
        Optional<Direction> OptionalDirection = direction_Repository.findById(serviceCentreDto.getId_direction());
        OptionalDirection.orElseThrow(() -> new RuntimeException("Direction not found with id: " + serviceCentreDto.getId_direction()));
        
        // Conversion DTO -> Entity
      
        Optionalservicentre.get().setDirection(OptionalDirection.get());
        Optionalservicentre.get().setTitre(serviceCentreDto.getTitre());
        // Mise à jour
        Service_Centre updatedEntity = serviceCentreRepository.save(Optionalservicentre.get());
        // Conversion Entity -> DTO et retour
        return Service_centre_dto.fromEntity(updatedEntity);
    }

    @Override
    @Transactional
    public Service_centre_dto findById(Long id) {
        // Recherche avec Optional pour une meilleure gestion des cas null
        return serviceCentreRepository.findById(id)
                .map(Service_centre_dto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException("Service Centre non trouvé avec l'ID : " + id));
    }

    @Override
    @Transactional
    public List<ListeServicecentredto> allServices_Centres() {
        // Récupération de toutes les entités
        List<Service_Centre> entities = serviceCentreRepository.findAll();

        // Conversion en DTOs
        return entities.stream()
                .map(ListeServicecentredto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<Service_centre_dto> chercherServices_Centres(String titre) {
        // Validation du paramètre de recherche
        if (titre == null || titre.trim().isEmpty()) {
            throw new IllegalArgumentException("Le critère de recherche ne peut pas être vide");
        }

        // Recherche avec LIKE pour une recherche partielle
        List<Service_Centre> entities = serviceCentreRepository.findByTitreContainingIgnoreCase(titre);

        // Conversion en DTOs
        return entities.stream()
                .map(Service_centre_dto::fromEntity)
                .collect(Collectors.toList());
    }
}

