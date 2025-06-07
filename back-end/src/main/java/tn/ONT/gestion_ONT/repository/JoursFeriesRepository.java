package tn.ONT.gestion_ONT.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.ONT.gestion_ONT.entity.JourFerie;
import tn.ONT.gestion_ONT.entity.TypeJourFerie;

@Repository
public interface JoursFeriesRepository extends JpaRepository<JourFerie, Long> {
  
    boolean existsByDate(Date date);
    List<JourFerie> findByAnneeOrderByDate(int annee);
  
    @Query("SELECT j FROM JourFerie j WHERE j.date BETWEEN :dateDebut AND :dateFin ORDER BY j.date")
    List<JourFerie> findByPeriode(@Param("dateDebut") Date dateDebut, @Param("dateFin") Date dateFin);
  
    List<JourFerie> findByAnneeAndEstVariableTrue(int annee);
    List<JourFerie> findByTypeAndAnnee(TypeJourFerie type, int annee);
    boolean existsByNomAndAnnee(String nom, int annee);
}

