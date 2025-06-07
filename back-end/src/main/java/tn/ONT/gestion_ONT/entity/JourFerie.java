package tn.ONT.gestion_ONT.entity;
import java.util.Date;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JourFerie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
  
    @Temporal(TemporalType.DATE)
    private Date date;
  
    private String nom;
  
    private String description;
  
    @Enumerated(EnumType.STRING)
    private TypeJourFerie type;
  
    private int annee;
  
    private boolean estRecurrent = false;
    private boolean estVariable = false;
      private String creePar;
  
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
}
