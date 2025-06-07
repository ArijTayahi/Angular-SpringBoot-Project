package tn.ONT.gestion_ONT.entity;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AjoutJourFerieRequest {
    private String nom;
    private Date date;
    private String description;
}
