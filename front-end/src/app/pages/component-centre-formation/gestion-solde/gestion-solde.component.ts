import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { Employee } from '../../../models-gestion-ont/employee';
import { Listeservicedto } from '../../../models-gestion-ont/service-centre';
import { AuthService } from '../../../services-gestion-ont/auth.service';
import { ServiceCentreService } from '../../../services-gestion-ont/service-centre-service';
import { Grade } from '../gestion-employe/grade';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductService } from '../../service/product.service';
import { SoldeCongeService } from '../../../services-gestion-ont/solde-conge.service';
import { SoldeCongeDto } from '../../../models-gestion-ont/SoldeCongeDto';
import { Inputsoldedto } from '../../../models-gestion-ont/inputsolde';

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
  selector: 'app-gestion-solde',
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
  templateUrl: './gestion-solde.component.html',
  styleUrls: ['./gestion-solde.component.scss'],
    providers: [MessageService, ConfirmationService]
  
})
export class GestionSoldeComponent implements OnInit{
//inputs?:Inputsoldedto
inputs: Inputsoldedto = {
    employeId: 0,    // Initialize with default values
    annee: new Date().getFullYear(), // Current year as default
    soldeInitial: 0
  };

 
  soldeCree?: SoldeCongeDto;
  erreur?: string;

   grades = Object.values(Grade).map(grade => ({
          label: this.formatLabel(grade),
          value: grade
        }));
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
          private serviceCentreService:ServiceCentreService,
          private soldeCongeService: SoldeCongeService
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
  
  
      openNew(id:number) {
        console.log("uuuu",IDBDatabase)
        this.inputs.employeId=id;
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
                  });ng
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
  
            
       /* onCreerSolde(){

      console.log("aaaa",this.annee);
            console.log("aaaa",this.soldeInitial);


    this.soldeCongeService.creerSolde( this.employeId,this.annee, this.soldeInitial).subscribe({
      next: (data) => {
        this.soldeCree = data;
        console.log('Solde créé avec succès :', data);
        this.erreur = undefined;
      },
      error: (err) => {
        console.error('Erreur lors de la création du solde :', err);
        this.erreur = 'Erreur lors de la création du solde.';
      }
    });
  }*/
 creerSolde() {
    
      console.log("gggggggggggggt",this.inputs)

      this.soldeCongeService.creerSoldee(this.inputs).subscribe({
        next: (data) => {
          this.soldeCree = data;
          this.erreur = '';
        },
        error: (err) => {
          this.erreur = 'Erreur lors de la création du solde.';
          this.soldeCree = null;
        }
      });
    }
  }
  
     

 



