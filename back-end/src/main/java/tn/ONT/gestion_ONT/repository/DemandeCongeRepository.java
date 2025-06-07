package tn.ONT.gestion_ONT.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.ONT.gestion_ONT.entity.DemandeConge;
import tn.ONT.gestion_ONT.entity.Employe;

public interface DemandeCongeRepository extends JpaRepository<DemandeConge, Long> {

    boolean existsByEmployeAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(
        Employe employe, Date dateFin, Date dateDebut);

    List<DemandeConge> findAllByEmployeId(Long employeId);
    
    @Query("SELECT d FROM DemandeConge d JOIN d.employe e WHERE e.service_centre.id = :serviceCentreId " +
           "AND d.statut = 'VALIDEE' AND " +
           "((d.dateDebut <= :dateFin AND d.dateFin >= :dateDebut) OR " +
           "(d.dateDebut >= :dateDebut AND d.dateDebut <= :dateFin) OR " +
           "(d.dateFin >= :dateDebut AND d.dateFin <= :dateFin))")
    List<DemandeConge> findByServiceCentreAndPeriode(
            @Param("serviceCentreId") Long serviceCentreId,
            @Param("dateDebut") Date dateDebut,
            @Param("dateFin") Date dateFin);
}

