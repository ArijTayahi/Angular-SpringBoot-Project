package tn.ONT.gestion_ONT.repository;

import java.util.Date;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.Service_Centre;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
    
    @Query("SELECT COUNT(e) FROM Employe e WHERE e.service_centre = :service " +
           "AND e.id NOT IN (" +
           "  SELECT d.employe.id FROM DemandeConge d " +
           "  WHERE d.statut = 'VALIDEE' " +
           "  AND :date BETWEEN d.dateDebut AND d.dateFin" +
           ")")
    long countByServiceAndDateNotEnConge(@Param("service") Service_Centre service, @Param("date") Date date);
}