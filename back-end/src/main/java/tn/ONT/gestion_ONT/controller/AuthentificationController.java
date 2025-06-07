package tn.ONT.gestion_ONT.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.auth.AuthentificationService;
import tn.ONT.gestion_ONT.dto.CadreDirecteurDto;
import tn.ONT.gestion_ONT.dto.EmployeDto;
import tn.ONT.gestion_ONT.modeleSecurité.AuthentificationRequest;
import tn.ONT.gestion_ONT.modeleSecurité.AuthentificationResponse;
import tn.ONT.gestion_ONT.modeleSecurité.Response;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthentificationController {
  private final AuthentificationService service;
  //private final UserService userService;
  @PostMapping("/registerEmploye")
  public ResponseEntity<Response> register(
          @RequestBody 
          EmployeDto userRequest,
          HttpServletRequest request
  )  {
    return service.register(userRequest,request);
  }
  
  @PostMapping("/registerCadreDto")
  public ResponseEntity<Response> registerCadreDto(
          @RequestBody 
          CadreDirecteurDto userRequest,
          HttpServletRequest request
  )  {
    return service.register(userRequest,request);
  }
 
  @PostMapping("/authenticate")
  public ResponseEntity<AuthentificationResponse> authenticate(
      @RequestBody AuthentificationRequest request
  ) {
    return ResponseEntity.ok(service.authenticate(request));
  }
  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }
@GetMapping("/lister_employe")
public List<EmployeDto> getAllEmploye() {
	return service.getAllEmploye();
}
@GetMapping("/employe_by_id/{id}")
public EmployeDto getEmployeById(@PathVariable("id") Long id) {
	
	return service.getEmployeById(id);
}

@PutMapping("/update")
public EmployeDto updateEmploye(@RequestBody EmployeDto employeDTO) {
	return service.updateEmploye(employeDTO);
}
@GetMapping("/me")
public ResponseEntity<EmployeDto> getCurrentUser(HttpServletRequest request) {
    try {
        // Extraire le token du header Authorization
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String token = authHeader.substring(7);
        
        // Décoder le token pour obtenir l'utilisateur
        EmployeDto currentUser = service.getCurrentUserFromToken(token);
        return ResponseEntity.ok(currentUser);
        
    } catch (RuntimeException e) {
        System.err.println("Erreur d'authentification: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    } catch (Exception e) {
        System.err.println("Erreur serveur: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
  /*@GetMapping("/listvendeurs")
  public List<UserDto> getlistvendeurs(ModeleRole role) {
      return  userService.listvendeur(role);
  }*/
  
  

}

