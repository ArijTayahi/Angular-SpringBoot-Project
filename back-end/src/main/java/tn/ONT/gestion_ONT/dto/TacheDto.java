package tn.ONT.gestion_ONT.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.EtatTache;
import tn.ONT.gestion_ONT.entity.Tache;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TacheDto {

    private Long id;
    private String titre;
    private String description;
    private LocalDate dateEcheance;
    private EtatTache etatTache;

    public static TacheDto fromEntity(Tache tache) {
        return TacheDto.builder()
                .id(tache.getId())
                .titre(tache.getTitre())
                .description(tache.getDescription())
                .dateEcheance(tache.getDateEcheance())
                .etatTache(tache.getEtatTache())
                .build();
    }

    public static Tache toEntity(TacheDto dto) {
        Tache t = new Tache();
        t.setTitre(dto.getTitre());
        t.setDescription(dto.getDescription());
        t.setDateEcheance(dto.getDateEcheance());
        t.setEtatTache(dto.getEtatTache());
        return t;
    }
}

