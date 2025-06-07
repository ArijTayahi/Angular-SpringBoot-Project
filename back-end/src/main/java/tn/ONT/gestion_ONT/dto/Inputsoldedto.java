package tn.ONT.gestion_ONT.dto;

import org.springframework.web.bind.annotation.PathVariable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Inputsoldedto {
	private Long employeId;
    private int annee;
    private int soldeInitial;
}
