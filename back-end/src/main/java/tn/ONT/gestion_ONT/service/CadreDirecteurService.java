package tn.ONT.gestion_ONT.service;

import tn.ONT.gestion_ONT.dto.CadreDirecteurDto;
import java.util.List;

public interface CadreDirecteurService {

    CadreDirecteurDto createCadreDirecteur(CadreDirecteurDto cadreDirecteurDto);

    CadreDirecteurDto updateCadreDirecteur(CadreDirecteurDto cadreDirecteurDto);

    CadreDirecteurDto findById(Long id);

    List<CadreDirecteurDto> allCadreDirecteur();

    List<CadreDirecteurDto> chercherCadreDirecteur(String nom);

    void deleteById(Long id);
}
