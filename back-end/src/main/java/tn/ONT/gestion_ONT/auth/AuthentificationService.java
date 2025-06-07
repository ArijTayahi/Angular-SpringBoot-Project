package tn.ONT.gestion_ONT.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.ConfigSecurity.JwtService;
import tn.ONT.gestion_ONT.dto.CadreDirecteurDto;
import tn.ONT.gestion_ONT.dto.EmployeDto;
import tn.ONT.gestion_ONT.entity.Cadre_Directeur;
import tn.ONT.gestion_ONT.entity.Direction;
import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.entity.Grade;
import tn.ONT.gestion_ONT.entity.Role;
import tn.ONT.gestion_ONT.entity.Service_Centre;
import tn.ONT.gestion_ONT.entity.Token;
import tn.ONT.gestion_ONT.entity.TokenType;
import tn.ONT.gestion_ONT.entity.User;
import tn.ONT.gestion_ONT.modeleSecurité.AuthentificationRequest;
import tn.ONT.gestion_ONT.modeleSecurité.AuthentificationResponse;
import tn.ONT.gestion_ONT.modeleSecurité.Register_Request;
import tn.ONT.gestion_ONT.modeleSecurité.Response;
import tn.ONT.gestion_ONT.repository.Cadre_DirecteurRepository;
import tn.ONT.gestion_ONT.repository.DirectionRepository;
import tn.ONT.gestion_ONT.repository.EmployeRepository;
import tn.ONT.gestion_ONT.repository.RoleRepository;
import tn.ONT.gestion_ONT.repository.Service_Centre_Repository;
import tn.ONT.gestion_ONT.repository.TokenRepository;
import tn.ONT.gestion_ONT.repository.UserRepository;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor

public class AuthentificationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final ApplicationEventPublisher publisher;
  private final  RoleRepository roleRepository;
 private final EmployeRepository employeRepository;
 private final DirectionRepository directionRepository;
private final Service_Centre_Repository centre_Repository;
 
 
 
  public ResponseEntity<Response>  register(Register_Request userRequest,final HttpServletRequest request) {
  
    boolean userExists = repository.findAll()
       .stream()
       .anyMatch(user -> userRequest.getEmail().equalsIgnoreCase(user.getEmail()));

if (userExists) {
   return ResponseEntity.badRequest().body(Response.builder()
           .responseMessage("User with provided email  already exists!")
           .build());
}
//parent
if (userRequest instanceof EmployeDto) {
	Employe user = new Employe();
   user = EmployeDto.toEntity((EmployeDto)userRequest);
   user.setPassword(passwordEncoder.encode(user.getPassword()));
   List<Role> roles = new ArrayList<>();

       Role userRole = roleRepository.findByName("employe")
               .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
       roles.add(userRole);
      
   Optional<Service_Centre> OptionalService_centre =  centre_Repository.findById(userRequest.getId_service_centre());
   OptionalService_centre.orElseThrow(() -> new RuntimeException("Service/Centre not found with id: " + userRequest.getId_service_centre()));
   user.setService_centre(OptionalService_centre.get());
   user.setRoles(roles);
   user.setEnabled(true);
   var savedUser = repository.save(user);
  // publisher.publishEvent(new RegistrationCompleteEvent(savedUser, applicationUrl(request)));

   return new ResponseEntity<>(
           Response.builder()

                   .responseMessage("Success! Please, check your email to complete your registration")
                   .email(savedUser.getEmail())
                   .build(),
           HttpStatus.CREATED
   );
}
if (userRequest instanceof CadreDirecteurDto) {
	
    Cadre_Directeur user = CadreDirecteurDto.toEntity((CadreDirecteurDto) userRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Long idDirection = ((CadreDirecteurDto) userRequest).getIdDirection();
        Direction direction = directionRepository.findById(idDirection )
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        user.setDirection(direction);
        user.setEnabled(true);
        List<Role> roles = new ArrayList<>();

            Role userRole = roleRepository.findByName("directeur")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
     
        user.setRoles(roles);
        var savedUser = repository.save(user);

        return new ResponseEntity<>(Response.builder()
                .responseMessage("Success! Please, check your email to complete your registration")
                .email(savedUser.getEmail())
                .build(), HttpStatus.CREATED);
    }

    return null;
    }

  public AuthentificationResponse authenticate(AuthentificationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );
    var user = repository.findByEmail(request.getEmail())
        .orElseThrow();
    var claims = new HashMap<String, Object>();
    claims.put("fullname", user.getNom() + " " + user.getPrenom());
    claims.put("userId", user.getId());
    var jwtToken = jwtService.generateToken(claims,user);
    //var jwtToken = jwtService.generateToken(user);
   
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserToken(user, jwtToken);
    return AuthentificationResponse.builder()
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
        .build();
  }

  private void saveUserToken(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
  }

  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        var authResponse = AuthentificationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }



    @PostConstruct
  public void createDefaultAdmin() {

      User user =new Employe();
      String email = "<div class=\"modal\" tabindex=\"-1\">\r\n"
      		+ "  <div class=\"modal-dialog\">\r\n"
      		+ "    <div class=\"modal-content\">\r\n"
      		+ "      <div class=\"modal-header\">\r\n"
      		+ "        <h5 class=\"modal-title\">Modal title</h5>\r\n"
      		+ "        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\r\n"
      		+ "      </div>\r\n"
      		+ "      <div class=\"modal-body\">\r\n"
      		+ "        <p>Modal body text goes here.</p>\r\n"
      		+ "      </div>\r\n"
      		+ "      <div class=\"modal-footer\">\r\n"
      		+ "        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\r\n"
      		+ "        <button type=\"button\" class=\"btn btn-primary\">Save changes</button>\r\n"
      		+ "      </div>\r\n"
      		+ "    </div>\r\n"
      		+ "  </div>\r\n"
      		+ "</div>";
     
      if (roleRepository.findByName("employe").isEmpty()) {
          roleRepository.save(Role.builder().name("employe").build());
      }
      if (roleRepository.findByName("directeur").isEmpty()) {
          roleRepository.save(Role.builder().name("directeur").build());
      }
      if (roleRepository.findByName("admin").isEmpty()) {
          roleRepository.save(Role.builder().name("admin").build());
      }
      
      String emailadm = "adminsys@gmail.com";
      if (!repository.existsByEmail(emailadm)) {
          user.setEmail("adminsys@gmail.com");
          user.setNom("Tayahi");
          user.setPrenom("Arij");
          user.setEnabled(true);
          user.setPassword(passwordEncoder.encode("admine"));
          user.setAdresse("uytrez");
          user.setAvatar("AZERTY");  
          user.setGrade(Grade.CHEF_DEPARTEMENT);
          user.setMatricule(1244);
          user.setTlf("123");
List<Role> roles = new ArrayList<>();
          Role userRole = roleRepository.findByName("admin")
                  .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
          user.setRoles(roles);

          repository.save(user);
      }
}
    public List<EmployeDto> getAllEmploye() {
        List<Employe> employe = employeRepository.findAll();
        return employe.stream()
                .map(EmployeDto::fromEntity)
                .collect(Collectors.toList());
        
    }
    
    public EmployeDto getEmployeById(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employe non trouvé"));
        return EmployeDto.fromEntity(employe);
    }

    
    public EmployeDto updateEmploye( EmployeDto employeDTO) {
        System.out.println(employeDTO.getId());

        Employe employe = employeRepository.findById(employeDTO.getId())
                .orElseThrow(() -> new RuntimeException("Employe non trouvé"));
       employe.setEmail(employeDTO.getEmail());
       employe.setTlf(employeDTO.getTlf());
       employe.setAdresse(employeDTO.getAdresse());
       employe.setAvatar(employeDTO.getAvatar());
       employe.setNom(employeDTO.getNom());
       employe.setPrenom(employeDTO.getPrenom());
       employe.setGrade(employeDTO.getGrade());      
        Employe updatedEmploye = employeRepository.save(employe);
        return employeDTO.fromEntity(updatedEmploye);
    }
 // Ajoutez cette méthode dans votre AuthentificationService
    public EmployeDto getCurrentUserFromToken(String token) {
        try {
            // Extraire l'email/username du token JWT
            String userEmail = jwtService.extractUsername(token);
            
            if (userEmail == null) {
                throw new RuntimeException("Token invalide - impossible d'extraire l'email");
            }
            
            // Chercher l'utilisateur dans la base de données
            User user = repository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email: " + userEmail));
            
            // Vérifier si c'est un Employe
            if (user instanceof Employe) {
                Employe employe = (Employe) user;
                return EmployeDto.fromEntity(employe);
            } else {
                throw new RuntimeException("L'utilisateur connecté n'est pas un employé");
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'extraction des informations utilisateur du token: " + e.getMessage(), e);
        }
    }

    // Méthode alternative utilisant l'ID utilisateur du token
    public EmployeDto getCurrentUserFromTokenById(String token) {
        try {
            // Version manuelle si extractClaim n'existe pas
            String[] chunks = token.split("\\.");
            String payload = new String(Base64.getDecoder().decode(chunks[1]));
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(payload);
            Long userId = jsonNode.get("userId").asLong();
            
            if (userId == null) {
                throw new RuntimeException("Token invalide - impossible d'extraire l'ID utilisateur");
            }
            
            // Utiliser la méthode existante pour récupérer l'employé par ID
            return getEmployeById(userId);
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'extraction des informations utilisateur du token: " + e.getMessage(), e);
        }
    }

    // Si vous avez la méthode extractClaim dans votre JwtService, utilisez cette version
    public EmployeDto getCurrentUserFromTokenByIdWithJwtService(String token) {
        try {
            // Extraire l'ID utilisateur du token (basé sur vos claims dans authenticate())
            Long userId = jwtService.extractClaim(token, claims -> claims.get("userId", Long.class));
            
            if (userId == null) {
                throw new RuntimeException("Token invalide - impossible d'extraire l'ID utilisateur");
            }
            
            // Utiliser la méthode existante pour récupérer l'employé par ID
            return getEmployeById(userId);
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'extraction des informations utilisateur du token: " + e.getMessage(), e);
        }
    }


    }






