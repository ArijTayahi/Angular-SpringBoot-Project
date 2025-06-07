package tn.ONT.gestion_ONT.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.ONT.gestion_ONT.dto.ProfilUserDto;
import tn.ONT.gestion_ONT.service.ProfilUserService;

@RestController
@RequestMapping("/api/v1/profilUser")
public class ProfilUserController {
	 @Autowired
	 private ProfilUserService profilUserService;
	 
    @GetMapping("/getprofil")
    public ProfilUserDto getUtilisateurById() {
        return profilUserService.findById();
    }

    @PutMapping("/update")
    public ProfilUserDto updateProfilUser(@RequestBody ProfilUserDto profilUserDto) {
        return profilUserService.updateUser(profilUserDto);
    }
}
