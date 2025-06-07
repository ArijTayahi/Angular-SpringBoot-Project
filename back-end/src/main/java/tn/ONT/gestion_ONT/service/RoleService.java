package tn.ONT.gestion_ONT.service;

import java.util.List;

import org.springframework.stereotype.Service;

import tn.ONT.gestion_ONT.entity.Role;
import tn.ONT.gestion_ONT.repository.RoleRepository;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    public RoleService(RoleRepository roleRepository) { this.roleRepository = roleRepository; }
    public List<Role> getAllRoles() { return roleRepository.findAll(); }
}
