package tn.ONT.gestion_ONT.modeleSecurité;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthentificationResponse {


 @JsonProperty("accessToken")
 private String accessToken;
 @JsonProperty("refreshToken")
 private String refreshToken;
}

