import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services-gestion-ont/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthRequest } from '../../../models-gestion-ont/auth-request';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  authorities: { authority: string }[];
}
@Component({

  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator,ConfirmDialogModule,DropdownModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  checked: boolean = false;

  credentials : AuthRequest = new AuthRequest();
  hide = true;
  showAlert: boolean = false;
  message:string='';
  role:string=''


  //loginForm: FormGroup;


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService
  ) {}


  ngOnInit() {


    this._authService.logout();
  }


  // On Forgotpassword link click
  onForgotpassword() {
    this._router.navigate(['forgot-password'], {
      relativeTo: this._activatedRoute.parent,
    });
  }


  // On Signup link click
  onSignup() {
    this._router.navigate(['sign-up'], { relativeTo: this._activatedRoute.parent });
  }


  login() {
    
    console.log("Arij ",this.credentials)
       // Sign in
       this._authService.signIn(this.credentials).subscribe({
        next: (response) => {
            // Set the redirect url.
            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
            // to the correct page after a successful sign in. This way, that url can be set via
            // routing file and we don't have to touch here.
       


            const token = response.accessToken;      
           const decodedToken = jwtDecode<CustomJwtPayload>(token);
          const authorities = decodedToken.authorities[0].authority;
           console.log(decodedToken.authorities[0].authority);
            localStorage.setItem("role",authorities)
            // Navigate to the redirect url
        },
        error: (error) => {
            console.log(error);
        


            // Set the alert
            this.message = "Email ou le mot de passe que vous avez entré est incorrect"


            // Show the alert
            this.showAlert = true;
        },
    });
    }
  }







