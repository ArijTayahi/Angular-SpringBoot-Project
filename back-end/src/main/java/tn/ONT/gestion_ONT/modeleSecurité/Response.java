package tn.ONT.gestion_ONT.modeleSecurité;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class Response {
   private String responseMessage;
   private String email;
}

