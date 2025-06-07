import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DirectionService } from '../../../services-gestion-ont/direction.service';
import { Listeservicedto, ServiceCentre } from '../../../models-gestion-ont/service-centre';
import { Direction } from '../../../models-gestion-ont/direction';
import { ServiceCentreService } from '../../../services-gestion-ont/service-centre-service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';



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
  standalone: true,
    templateUrl: './gestion-service-centre.component.html',
  styleUrl: './gestion-service-centre.component.scss',
  selector: 'app-gestion-service-centre',
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
    DropdownModule,
    ConfirmDialogModule],
    providers: [MessageService, DirectionService, ConfirmationService]
})
export class GestionServiceCentreComponent implements OnInit {

  serviceCentreDialog: boolean = false;
  
  
  servicesCentres = signal<Listeservicedto[]>([]);
   servicesCentress = signal<ServiceCentre[]>([]);
  directions = signal<Direction[]>([]);
  serviceCentre: ServiceCentre ={id:0, titre:'',id_direction:0};
  
  
      selectedserviceCentre!: Listeservicedto[] | null;
  
  
      submitted: boolean = false;
      submittedaddnew: boolean = false;
      submittedupdate: boolean = false;
      statuses!: any[];
  
  
      @ViewChild('dt') dt!: Table;
  
  
      exportColumns!: ExportColumn[];
  
  
      cols!: Column[];
  
  
      constructor(
          private servicedirection: DirectionService,
          private serviceCentreService: ServiceCentreService,
          private messageService: MessageService,
          private confirmationService: ConfirmationService
      ) {}
  
  
      exportCSV() {
          this.dt.exportCSV();
      }
  
  
      ngOnInit() {
          this.loadDemoData();
          this.loadDemoDatadirection()
         
      }
   loadDemoDatadirection() {
        this.servicedirection.getAllDirections().subscribe((data) => {
            this.directions.set(data);
        });
    }
  
      loadDemoData() {
          this.serviceCentreService.getAllServicesCentres().subscribe((data) => {
              this.servicesCentres.set(data);
  
  
              console.log("serviceCentreHHHHHHH",this.servicesCentres())
          });
          this.cols = [
            { field: 'id', header: 'id' }         
            ,
              { field: 'titre', header: 'Titre' } 
                ,
              { field: 'nom direction', header: 'nom direction' }           
          ];
  
          this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
      }
  
  
      onGlobalFilter(table: Table, event: Event) {
          table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }
  
  
      openNew() {
          this.serviceCentre = { id: 0, titre: '' ,id_direction: 0};
          this.submitted = false;
          this.serviceCentreDialog = true;
          this.submittedaddnew= true;
          this.submittedupdate= false;
      }
  
  
      editserviceCentre(serviceCentre: any) {
        
          this.serviceCentre = { ...serviceCentre };
          this.serviceCentreDialog = true;
          console.log("ridha",this.serviceCentre)
          this.submittedaddnew= false;
          this.submittedupdate= true;
      }
  
  
     /* deleteSelectedserviceCentre() {
          this.confirmationService.confirm({
              message: 'Are you sure you want to delete the selected serviceCentre?',
              header: 'Confirm',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  this.servicesCentres.set(this.servicesCentres().filter((val) => !this.selectedserviceCentre?.includes(val)));
                  this.selectedserviceCentre = null;
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'serviceCentre Deleted',
                      life: 3000
                  });
              }
          });
      }*/
  
  
      hideDialog() {
          this.serviceCentreDialog = false;
          this.submitted = false;
      }
  
  
      deleteServiceCentre(serviceCentre: ServiceCentre) {
        console.log("id service",serviceCentre.id);
          this.confirmationService.confirm({
              message: 'Are you sure you want to delete ' + serviceCentre.id + '?',
              header: 'Confirm',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  this.serviceCentreService.deleteServiceCentre(serviceCentre.id).subscribe({
                      next: (newServiceCentre) => {
                       
                      },
                      error: (err) => {
                          this.messageService.add({
                              severity: 'error',
                              summary: 'Error',
                              detail: 'Failed to create serviceCentre',
                              life: 3000
                          });
                          console.error('Error creating serviceCentre:', err);
                      }
                  });
                  this.servicesCentres.set(this.servicesCentres().filter((val) => val.id !== serviceCentre.id));
                  //this.Formation = new Formation();
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'serviceCentre Deleted',
                      life: 3000
                  });
              }
          });
      }
  
  
      findIndexById(id: number): number {
          let index = -1;
          for (let i = 0; i < this.servicesCentres().length; i++) {
              if (this.servicesCentres()[i].id === id) {
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
  
  
      saveServiceCentre() {
          this.submitted = true;
          console.log("arijjjjj",this.serviceCentre)
     
          if (this.serviceCentre.titre.trim()) {
              if (this.serviceCentre.id) {
  
  
                  this.serviceCentreService.updateServiceCentre(this.serviceCentre).subscribe({
                      next: (newServiceCentre) => {
                          this.loadDemoData();
                          this.messageService.add({
  
  
                              severity: 'success',
                              summary: 'Successful',
                              detail: 'serviceCentre Updated',
                              life: 3000
                          });
                      },
                      error: (err) => {
                          this.messageService.add({
                              severity: 'error',
                              summary: 'Error',
                              detail: 'Failed to create serviceCentre',
                              life: 3000
                          });
                          console.error('Error creating serviceCentre:', err);
                      }
                  });
              // Mise à jour locale de la formation dans le Signal Store
                 /*  let _Formations = this.formations();
                  _Formations[this.findIndexById(this.formation.id)] = this.formation;
                  this.formations.set([..._Formations]); */
     
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'serviceCentre Updated',
                      life: 3000
                  });
              } else {
                  console.log("hhhh2",this.serviceCentre)
                  // Consommer le service pour enregistrer la formation en backend
                  this.serviceCentreService.createServiceCentre(this.serviceCentre).subscribe({
                      next: (newServiceCentre) => {
                          this.servicesCentress.set([...this.servicesCentress(), newServiceCentre]);
                          this.messageService.add({
                              severity: 'success',
                              summary: 'Successful',
                              detail: 'serviceCentre Created',
                              life: 3000
                          });
                      },
                      error: (err) => {
                          this.messageService.add({
                              severity: 'error',
                              summary: 'Error',
                              detail: 'Failed to create serviceCentre',
                              life: 3000
                          });
                          console.error('Error creating serviceCentre:', err);
                      }
                  });
              }
     
              this.serviceCentreDialog = false;
          }
      }
        
  onFormationSelect($event: DropdownChangeEvent) {
throw new Error('Method not implemented.');
}
    

}
