package tn.ONT.gestion_ONT.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.ONT.gestion_ONT.entity.EtatTache;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Tachesempdto {
	
	
	private TacheDto tache;
    private List<Long> idEmps;
}
