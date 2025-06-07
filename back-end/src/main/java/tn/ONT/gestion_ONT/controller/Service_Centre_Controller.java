package tn.ONT.gestion_ONT.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import tn.ONT.gestion_ONT.dto.ListeServicecentredto;
import tn.ONT.gestion_ONT.dto.Service_centre_dto;
import tn.ONT.gestion_ONT.service.Service_Centre_Service;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services-centres")
public class Service_Centre_Controller {

    private final Service_Centre_Service serviceCentreService;

    // Injection par constructeur
    public Service_Centre_Controller(Service_Centre_Service serviceCentreService) {
        this.serviceCentreService = serviceCentreService;
    }

    // Créer un nouveau service centre
    @PostMapping("/create")
    public ResponseEntity<Service_centre_dto> createServiceCentre(@RequestBody Service_centre_dto serviceCentreDto) {
        Service_centre_dto createdService = serviceCentreService.createServices_Centres(serviceCentreDto);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    // Récupérer tous les services centres
    @GetMapping("/All")
    public ResponseEntity<List<ListeServicecentredto>> getAllServiceCentres() {
        List<ListeServicecentredto> services = serviceCentreService.allServices_Centres();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // Récupérer un service centre par ID
    @GetMapping("/getbyid/{id}")
    public ResponseEntity<Service_centre_dto> getServiceCentreById(@PathVariable Long id) {
        Service_centre_dto service = serviceCentreService.findById(id);
        return new ResponseEntity<>(service, HttpStatus.OK);
    }

    // Mettre à jour un service centre
    @PutMapping("/update")
    public ResponseEntity<Service_centre_dto> updateServiceCentre(@RequestBody Service_centre_dto serviceCentreDto) {
        Service_centre_dto updatedService = serviceCentreService.updateServices_Centres(serviceCentreDto);
        return new ResponseEntity<>(updatedService, HttpStatus.OK);
    }

    // Supprimer un service centre
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteServiceCentre(@PathVariable Long id) {
        serviceCentreService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Rechercher des services centres par titre
    @GetMapping("/getServiceCentre")
    public ResponseEntity<List<Service_centre_dto>> searchServiceCentres(@RequestParam String titre) {
        List<Service_centre_dto> services = serviceCentreService.chercherServices_Centres(titre);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // Gestion des exceptions
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}


