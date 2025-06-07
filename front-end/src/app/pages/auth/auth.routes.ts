import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { LoginComponent } from '../component-centre-formation/login/login.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
   /* { path: 'signUp', component: SignUp },*/

    { path: 'login', component: LoginComponent }
] as Routes;
