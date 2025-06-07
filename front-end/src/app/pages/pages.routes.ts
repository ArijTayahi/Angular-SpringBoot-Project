import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { GestionEmployeComponent } from './component-centre-formation/gestion-employe/gestion-employe.component';
import { GestionDirectionComponent } from './component-centre-formation/gestion-direction/gestion-direction.component';
import { GestionServiceCentreComponent } from './component-centre-formation/gestion-service-centre/gestion-service-centre.component';
import { GestionCongeComponent } from './component-centre-formation/gestion-conge/gestion-conge.component';
import { GestionTacheComponent } from './component-centre-formation/gestion-tache/gestion-tache.component';
import { GestionSoldeComponent } from './component-centre-formation/gestion-solde/gestion-solde.component';
import { DemandeCongeEmpComponent } from './component-centre-formation/demande-conge-emp/demande-conge-emp.component';
import { ListeTachesEmpComponent } from './component-centre-formation/liste-taches-emp/liste-taches-emp.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'consult-profile', component: UserProfileComponent },
    {path: 'crud', component: Crud},
    {path: 'gestionEmploye', component: GestionEmployeComponent},//direction
    {path: 'gestionDirection', component: GestionDirectionComponent},//Admin
    {path: 'gestionConge', component: GestionCongeComponent},//direction
    {path: 'gestionTache', component: GestionTacheComponent},//direction
 {path: 'gestionSolde', component: GestionSoldeComponent},//direction
  {path: 'gestionCongeEmp', component: DemandeCongeEmpComponent},//employe
    {path: 'ListeTachesEmp', component:   ListeTachesEmpComponent},//employe
    {path: 'gestionServiceCentre', component: GestionServiceCentreComponent},//direction
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
