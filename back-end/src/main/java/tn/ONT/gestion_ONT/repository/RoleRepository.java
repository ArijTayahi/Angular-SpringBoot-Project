package tn.ONT.gestion_ONT.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.ONT.gestion_ONT.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

	   Optional<Role>  findByName(String name);

}
