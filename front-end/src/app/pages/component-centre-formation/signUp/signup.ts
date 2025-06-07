import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services-gestion-ont/auth.service';
import { Employe } from '../../../models-gestion-ont/employe';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ButtonModule, 
    CheckboxModule, 
    InputTextModule, 
    PasswordModule, 
    FormsModule, 
    RouterModule, 
    RippleModule, 
    AppFloatingConfigurator,
    DropdownModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class Signup implements OnInit {
  newUser: Employe = new Employe();
  showAlert: boolean = false;
  message: string = '';
  acceptTerms: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    // Initialize any necessary data
  }

  // On login link click
  onLogin() {
    this._router.navigate(['login'], { relativeTo: this._activatedRoute.parent });
  }

  register() {
    if (!this.validateForm()) {
      return;
    }

    this._authService.signUpEmploye(this.newUser).subscribe({
      next: (response) => {
        this.message = "Registration successful! Please login to continue.";
        this.showAlert = true;
        // Redirect to login after a short delay
        setTimeout(() => {
          this._router.navigate(['login'], { relativeTo: this._activatedRoute.parent });
        }, 2000);
      },
      error: (error) => {
        console.error(error);
        this.message = "Registration failed. Please try again.";
        this.showAlert = true;
      }
    });
  }

  validateForm(): boolean {
    if (!this.newUser.email || !this.newUser.password || !this.newUser.nom || !this.newUser.prenom) {
      this.message = "Please fill in all required fields";
      this.showAlert = true;
      return false;
    }

    if (!this.acceptTerms) {
      this.message = "Please accept the terms and conditions";
      this.showAlert = true;
      return false;
    }

    return true;
  }
}