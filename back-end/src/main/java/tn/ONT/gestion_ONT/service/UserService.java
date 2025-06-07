package tn.ONT.gestion_ONT.service;

import java.util.List;

import org.springframework.stereotype.Service;

import tn.ONT.gestion_ONT.entity.User;
import tn.ONT.gestion_ONT.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }
    public List<User> getAllUsers() { return userRepository.findAll(); }
}
