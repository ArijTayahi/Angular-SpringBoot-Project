package tn.ONT.gestion_ONT.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.SoldeConge;

public interface SoldeCongeRepository extends JpaRepository<SoldeConge, Long> {
    Optional<SoldeConge> findByEmployeAndAnnee(Employe employe, int annee);
    List<SoldeConge> findAllByEmployeId(Long employeId);
    
    
}
