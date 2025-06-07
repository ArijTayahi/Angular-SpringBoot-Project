import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];
 role : string ="";

    ngOnInit() {
    const token = localStorage.getItem('token');
    this.role = localStorage.getItem('role') || '';

    console.log('roles', this.role);

    this.model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            routerLink: ['/auth/login']
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            routerLink: ['/auth/error']
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: ['/auth/access']
                        }
                    ]
                },
                ...(this.role === 'employe' ? [
                    {
                        label: 'Gestion Conge Employe',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionCongeEmp']
                    },
                    {
                        label: 'Liste Taches Emp',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/ListeTachesEmp']
                    },
                      {
                        label: 'Consulter Profile',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/pages/consult-profile']
                    }
                ] : []),
                ...(this.role === 'admin' ? [
                    {
                        label: 'Gestion Direction',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionDirection']
                    }
                ] : []),
                ...(this.role === 'directeur' ? [
                    {
                        label: 'Gestion Conge',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionConge']
                    },
                    {
                        label: 'Gestion Tache',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionTache']
                    },
                    {
                        label: 'Gestion Employe',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionEmploye']
                    },
                    {
                        label: 'Gestion Service Centre',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionServiceCentre']
                    },
                    {
                        label: 'Gestion Solde',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/gestionSolde']
                    }
                ] : [])
            ]
        }
    ];
}



}
