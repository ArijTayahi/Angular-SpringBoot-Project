package tn.ONT.gestion_ONT.service;

import java.util.List;

import tn.ONT.gestion_ONT.dto.ListeServicecentredto;
import tn.ONT.gestion_ONT.dto.Service_centre_dto;

public interface Service_Centre_Service {
	
	void deleteById (Long id);
	Service_centre_dto createServices_Centres(Service_centre_dto Service_centreDto);
	Service_centre_dto updateServices_Centres(Service_centre_dto Service_centreDto);
	Service_centre_dto findById(Long id);
	List<ListeServicecentredto> allServices_Centres(); 
	List<Service_centre_dto> chercherServices_Centres(String titre);

}
