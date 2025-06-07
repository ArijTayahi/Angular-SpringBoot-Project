package tn.ONT.gestion_ONT.service;

import java.util.List;

import org.springframework.stereotype.Service;

import tn.ONT.gestion_ONT.entity.Employe;
import tn.ONT.gestion_ONT.repository.EmployeRepository;

@Service
public class EmployeService {
    private final EmployeRepository employeRepository;
    
    public EmployeService(EmployeRepository employeRepository) { 
    	this.employeRepository = employeRepository; }
    
    public List<Employe> getAllEmployes() {
    	return employeRepository.findAll(); 
    	}
}
