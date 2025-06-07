import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Employee } from '../../../models-gestion-ont/employee';
import { Table, TableCheckbox, TableModule } from 'primeng/table';
import { AuthService } from '../../../services-gestion-ont/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employe } from '../../../models-gestion-ont/employe';
import { Grade } from './grade';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductService } from '../../service/product.service';
import { ServiceCentreService } from '../../../services-gestion-ont/service-centre-service';
import { Listeservicedto, ServiceCentre } from '../../../models-gestion-ont/service-centre';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}


interface ExportColumn {
  title: string;
  dataKey: string;
}


@Component({
  selector: 'app-gestion-employe',
  standalone: true,

  imports: [CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,DropdownModule ],


  templateUrl: './gestion-employe.component.html',
  styleUrl: './gestion-employe.component.scss',
  providers: [MessageService, ProductService, ConfirmationService]


  
})
export class GestionEmployeComponent implements OnInit {

    grades = Object.values(Grade).map(grade => ({
        label: this.formatLabel(grade),
        value: grade
      }));
    servicedirection: any;
    directions: any;
      formatLabel(grade: string): string {
        return grade
          .split('_')
          .map(word => word.charAt(0) + word.slice(1).toLowerCase())
          .join(' ');
      }
      
         servicesCentress = signal<Listeservicedto[]>([]);
      
    
      
  
    //grades=[{label:"AGENT",value:Grade.AGENT}]

  employeDialog : boolean = false;


    employes = signal<Employee[]>([]);


   employe: Employee ={id:0, nom :'',prenom :'',password :'', tlf :'', matricule :'', grade: Grade.AGENT, adresse:'',  email :'',  avatar :'',dateNais:new Date(),roles : [],id_service_centre:0};;


    selectedEmploye!: Employee[] | null;


    submitted: boolean = false;
    submittedaddnew: boolean = false;
    submittedupdate: boolean = false;
    statuses!: any[];


    @ViewChild('dt') dt!: Table;


    exportColumns!: ExportColumn[];


    cols!: Column[];


    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private serviceCentreService:ServiceCentreService
    ) {}


    exportCSV() {
        this.dt.exportCSV();
    }


    ngOnInit() {
        this.loadDemoData();
        console.log(this.grades);
    this.loadDemoDataServiceCentre();
       
    }
  loadDemoDataServiceCentre() {
        this.serviceCentreService.getAllServicesCentres().subscribe((data) => {
            this.servicesCentress.set(data);
        });
    }
      
    

    loadDemoData() {
        this.authService.getAllemploye().subscribe((data) => {
            this.employes.set(data);


            console.log("employes",this.employes())
        });
        this.cols = [
          { field: 'id', header: 'Id' },
            { field: 'nom', header: 'Nom' },
            { field: 'prenom', header: 'Prenom' },
            { field: 'matricule', header: 'Matricule' },
            { field: 'tlf', header: 'Tlf' },
            { field: 'grade', header: 'Grade' },
            { field: 'adresse', header: 'Adresse' },
            { field: 'dateNais', header: 'dateNais' },
            { field: 'Avatar', header: 'avatar' },

        ];


        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    openNew() {
        this.employe={id:0, nom :'',prenom :'',password :'', tlf :'', matricule :'', grade :Grade.AGENT, adresse:'',  email :'',  avatar :'',dateNais:new Date(),roles : [],id_service_centre:0};
        this.submitted = false;
        this.employeDialog = true;
        this.submittedaddnew= true;
        this.submittedupdate= false;
    }


    editEmploye(employe: Employee) {
        this.employe = { ...employe };
        this.employeDialog = true;
        console.log("ariiiiij",this.employe)
        this.submittedaddnew= false;
        this.submittedupdate= true;
    }

/*
    deleteSelectedEmployes() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected Formations?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.formations.set(this.formations().filter((val) => !this.selectedFormations?.includes(val)));
                this.selectedFormations = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Formations Deleted',
                    life: 3000
                });
            }
        });
    }
*/

    hideDialog() {
        this.employeDialog = false;
        this.submitted = false;
    }

/*
    deleteFormation(formation: Formation) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + formation.sessionIds + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.formationService.deleteEntity(this.formation.id).subscribe({
                    next: (newFormation) => {
                     
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create formation',
                            life: 3000
                        });
                        console.error('Error creating formation:', err);
                    }
                });
                this.formations.set(this.formations().filter((val) => val.id !== formation.id));
                //this.Formation = new Formation();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Formation Deleted',
                    life: 3000
                });
            }
        });
    }
*/

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.employes().length; i++) {
            if (this.employes()[i].id === id) {
                index = i;
                break;
            }
        }


        return index;
    }


  /*   createId(): number {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    } */


    /* getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    } */


    saveEmploye() {
        console.log(this.employe)
        this.submitted = true;
   
        if (this.employe.nom.trim()) {
            if (this.employe.id) {


                this.authService.updatemploye(this.employe).subscribe({
                    next: (newEmploye) => {
                        this.loadDemoData();
                        this.messageService.add({


                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Employe Updated',
                            life: 3000
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create Employe',
                            life: 3000
                        });
                        console.error('Error creating employe:', err);
                    }
                });


                // Mise à jour locale de la formation dans le Signal Store
               /*  let _Formations = this.formations();
                _Formations[this.findIndexById(this.formation.id)] = this.formation;
                this.formations.set([..._Formations]); */
   
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employe Updated',
                    life: 3000
                });
            } else {
                console.log("hhhh2",this.employe)
                // Consommer le service pour enregistrer la formation en backend
                this.authService.signUpEmploye(this.employe).subscribe({
                    next: (newEmploye) => {
                        this.employes.set([...this.employes(), newEmploye]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Employe Created',
                            life: 3000
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create employe',
                            life: 3000
                        });
                        console.error('Error creating employe:', err);
                    }
                });
            }
   
            this.employeDialog = false;
        }
    }
      onFormationSelect($event: DropdownChangeEvent) {
    throw new Error('Method not implemented.');
    }
   
}
