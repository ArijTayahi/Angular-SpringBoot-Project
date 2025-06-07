package tn.ONT.gestion_ONT.entity;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder

public class User implements UserDetails  {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String nom;
	private String prenom;
	private String password;
	private String tlf;
	private String adresse;
	private String email;
	private String avatar;
	private int matricule;
	private Date dateNais;
	@Enumerated(EnumType.STRING)
	private Grade grade;
	
	
	 @OneToMany(mappedBy ="user",cascade = CascadeType.ALL)
     private List<Token> tokens;
 @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    private VerificationToken verificationToken;
	
	@Builder.Default
	   private boolean enabled = false;
		 @ManyToMany(fetch =FetchType.EAGER)
		   private List<Role> roles;
		 
		 
		 @Override
		   public Collection<? extends GrantedAuthority> getAuthorities() {
		       return this.roles
		               .stream()
		               .map(role -> new SimpleGrantedAuthority(role.getName()))
		               .collect(Collectors.toList());
		   }
	  
	 
	 
	  @Override
	  public String getPassword() {
	     return password;
	  }
	  @Override
	  public String getUsername() {
	     return email;
	  }
	  @Override
	  public boolean isAccountNonExpired() {
	     return true;
	  }
	  @Override
	  public boolean isAccountNonLocked() {
	     return true;
	  }
	  @Override
	  public boolean isCredentialsNonExpired() {
	     return true;
	  }
	  @Override
	  public boolean isEnabled() {
	     return enabled;
	  }
	  
	  

}
