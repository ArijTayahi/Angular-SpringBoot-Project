package tn.ONT.gestion_ONT.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.CadreDirecteurDto;
import tn.ONT.gestion_ONT.entity.Cadre_Directeur;
import tn.ONT.gestion_ONT.repository.Cadre_DirecteurRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CadreDirecteurServiceImpl implements CadreDirecteurService {

    private final Cadre_DirecteurRepository cadreDirecteurRepository;

    @Override
    public void deleteById(Long id) {
        cadreDirecteurRepository.deleteById(id);
    }

    @Override
    public CadreDirecteurDto createCadreDirecteur(CadreDirecteurDto cadreDirecteurDto) {
        Cadre_Directeur cadreDirecteur = CadreDirecteurDto.toEntity(cadreDirecteurDto);
        
        cadreDirecteur = cadreDirecteurRepository.save(cadreDirecteur);
        
        return CadreDirecteurDto.fromEntity(cadreDirecteur);
    }

    @Override
    public CadreDirecteurDto updateCadreDirecteur(CadreDirecteurDto cadreDirecteurDto) {
        Cadre_Directeur cadreDirecteur = cadreDirecteurRepository.findById(cadreDirecteurDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cadre directeur non trouvé"));

        cadreDirecteur.setNom(cadreDirecteurDto.getNom());
        cadreDirecteur.setPrenom(cadreDirecteurDto.getPrenom());
        cadreDirecteur.setEmail(cadreDirecteurDto.getEmail());
        cadreDirecteur.setTlf(cadreDirecteurDto.getTlf());
        cadreDirecteur.setAdresse(cadreDirecteurDto.getAdresse());
        cadreDirecteur.setMatricule(cadreDirecteurDto.getMatricule());
        cadreDirecteur.setGrade(cadreDirecteurDto.getGrade());

        cadreDirecteur = cadreDirecteurRepository.save(cadreDirecteur);

        return CadreDirecteurDto.fromEntity(cadreDirecteur);
    }

    @Override
    public CadreDirecteurDto findById(Long id) {
        Cadre_Directeur cadreDirecteur = cadreDirecteurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cadre directeur non trouvé"));

        return CadreDirecteurDto.fromEntity(cadreDirecteur);
    }

    @Override
    public List<CadreDirecteurDto> allCadreDirecteur() {
        List<Cadre_Directeur> cadresDirecteurs = cadreDirecteurRepository.findAll();
        
        return cadresDirecteurs.stream()
                .map(CadreDirecteurDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CadreDirecteurDto> chercherCadreDirecteur(String nom) {
        List<Cadre_Directeur> cadresDirecteurs = cadreDirecteurRepository.findByNomContaining(nom);
        
        return cadresDirecteurs.stream()
                .map(CadreDirecteurDto::fromEntity)
                .collect(Collectors.toList());
    }
}
