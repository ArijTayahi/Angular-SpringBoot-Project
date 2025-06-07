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
import { TableModule, Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DirectionService } from '../../../services-gestion-ont/direction.service';
import { Direction } from '../../../models-gestion-ont/direction';

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
  selector: 'app-gestion-direction',
  templateUrl: './gestion-direction.component.html',
  styleUrl: './gestion-direction.component.scss',
  standalone : true,
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
    ConfirmDialogModule],
    providers: [MessageService, DirectionService, ConfirmationService],

})
export class GestionDirectionComponent implements OnInit {

  directionDialog: boolean = false;


    directions = signal<Direction[]>([]);


   direction: Direction ={id:0, titre:''};;


    selectedDirection!: Direction[] | null;


    submitted: boolean = false;
    submittedaddnew: boolean = false;
    submittedupdate: boolean = false;
    statuses!: any[];


    @ViewChild('dt') dt!: Table;


    exportColumns!: ExportColumn[];


    cols!: Column[];


    constructor(
        private directionService: DirectionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}


    exportCSV() {
        this.dt.exportCSV();
    }


    ngOnInit() {
        this.loadDemoData();
       
    }


    loadDemoData() {
        this.directionService.getAllDirections().subscribe((data) => {
            this.directions.set(data);


            console.log("directions",this.directions())
        });
        this.cols = [
          { field: 'id', header: 'id' }         
          ,
            { field: 'titre', header: 'Titre' }         
        ];


       


        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    openNew() {
        this.direction ={id:0, titre:''};
        this.submitted = false;
        this.directionDialog = true;
        this.submittedaddnew= true;
        this.submittedupdate= false;
    }


    editDirection(direction: Direction) {
        this.direction = { ...direction };
        this.directionDialog = true;
        console.log("ridha",this.direction)
        this.submittedaddnew= false;
        this.submittedupdate= true;
    }


    deleteSelectedDirections() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected Direction?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.directions.set(this.directions().filter((val) => !this.selectedDirection?.includes(val)));
                this.selectedDirection = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Direction Deleted',
                    life: 3000
                });
            }
        });
    }


    hideDialog() {
        this.directionDialog = false;
        this.submitted = false;
    }


    deleteDirection(direction: Direction) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + direction.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.directionService.deleteDirection(this.direction.id).subscribe({
                    next: (newFormation) => {
                     
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create direction',
                            life: 3000
                        });
                        console.error('Error creating direction:', err);
                    }
                });
                this.directions.set(this.directions().filter((val) => val.id !== direction.id));
                //this.Formation = new Formation();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Direction Deleted',
                    life: 3000
                });
            }
        });
    }


    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.directions().length; i++) {
            if (this.directions()[i].id === id) {
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


    saveDirection() {
        this.submitted = true;
   
        if (this.direction.titre.trim()) {
            if (this.direction.id) {


                this.directionService.updateDirection(this.direction).subscribe({
                    next: (newDirection) => {
                        this.loadDemoData();
                        this.messageService.add({


                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Direction Updated',
                            life: 3000
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create direction',
                            life: 3000
                        });
                        console.error('Error creating direction:', err);
                    }
                });


                // Mise à jour locale de la formation dans le Signal Store
               /*  let _Formations = this.formations();
                _Formations[this.findIndexById(this.formation.id)] = this.formation;
                this.formations.set([..._Formations]); */
   
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Direction Updated',
                    life: 3000
                });
            } else {
                console.log("hhhh2",this.direction)
                // Consommer le service pour enregistrer la formation en backend
                this.directionService.createDirection(this.direction).subscribe({
                    next: (newDirection) => {
                        this.directions.set([...this.directions(), newDirection]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Direction Created',
                            life: 3000
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create direction',
                            life: 3000
                        });
                        console.error('Error creating direction:', err);
                    }
                });
            }
   
            this.directionDialog = false;
        }
    }
   
}




