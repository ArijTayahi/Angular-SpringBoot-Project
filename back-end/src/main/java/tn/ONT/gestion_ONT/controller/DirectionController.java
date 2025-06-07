package tn.ONT.gestion_ONT.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import tn.ONT.gestion_ONT.dto.DirectionDto;
import tn.ONT.gestion_ONT.service.DirectionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/directions")
public class DirectionController {

    @Autowired
    private DirectionService directionService;

    @PostMapping("/create")
    public DirectionDto createDirection(@RequestBody DirectionDto directionDto) {
        return directionService.createDirection(directionDto);
    }

    @PutMapping("/update")
    public DirectionDto updateDirection(@RequestBody DirectionDto directionDto) {
        return directionService.updateDirection(directionDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDirection(@PathVariable Long id) {
        directionService.deleteById(id);
    }

    @GetMapping("/getdirecteur/{id}")
    public DirectionDto getDirectionById(@PathVariable Long id) {
        return directionService.findById(id);
    }

    @GetMapping("/All")
    public List<DirectionDto> getAllDirections() {
        return directionService.allDirection();
    }

    @GetMapping("/search")
    public List<DirectionDto> searchDirection(@RequestParam String titre) {
        return directionService.chercherDirection(titre);
    }
}

