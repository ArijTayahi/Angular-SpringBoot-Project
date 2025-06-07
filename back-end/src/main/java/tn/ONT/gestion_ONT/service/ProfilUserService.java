package tn.ONT.gestion_ONT.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tn.ONT.gestion_ONT.dto.CadreDirecteurDto;
import tn.ONT.gestion_ONT.dto.ProfilUserDto;
import tn.ONT.gestion_ONT.entity.Cadre_Directeur;
import tn.ONT.gestion_ONT.entity.User;
import tn.ONT.gestion_ONT.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProfilUserService {
	
	private final UserRepository userRepository;
	
	   //pour recuperer current user connecte
	   public User getCurrentUser() {
		    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		    if (authentication != null && authentication.getPrincipal() instanceof User) {
		        return (User) authentication.getPrincipal(); // si User implémente UserDetails
		    }

		    return null;
		}
	   
	    public ProfilUserDto findById() {
	    	Long idUser=getCurrentUser().getId();
	        User user = userRepository.findById(idUser)
	                .orElseThrow(() -> new IllegalArgumentException("utilisateur non trouvé"));

	        return ProfilUserDto.fromEntity(user);
	    }
	    
	    public ProfilUserDto updateUser(ProfilUserDto profilUserDto) {
	        User user = userRepository.findById(profilUserDto.getId())
	                .orElseThrow(() -> new IllegalArgumentException("utilisateur non trouvé"));

	        user.setNom(profilUserDto.getNom());
	        user.setPrenom(profilUserDto.getPrenom());
	        user.setEmail(profilUserDto.getEmail());
	        user.setTlf(profilUserDto.getTlf());
	        user.setAdresse(profilUserDto.getAdresse());
	        user.setAvatar(profilUserDto.getAvatar());

	        user = userRepository.save(user);

	        return ProfilUserDto.fromEntity(user);
	    }

}
