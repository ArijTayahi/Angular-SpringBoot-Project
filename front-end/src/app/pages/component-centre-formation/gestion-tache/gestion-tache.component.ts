import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TacheService } from '../../../services-gestion-ont/tache.service';
import { Employee } from '../../../models-gestion-ont/employee';
import { AuthService } from '../../../services-gestion-ont/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { Tache, Tachesempdto } from '../../../models-gestion-ont/tache';
import { EtatTache } from '../../../models-gestion-ont/etat-tache';

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
  selector: 'app-gestion-tache',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    ConfirmDialogModule,
    ProgressBarModule
  ],
  templateUrl: './gestion-tache.component.html',
  providers: [MessageService, ConfirmationService]
})
export class GestionTacheComponent implements OnInit {
    employees: Employee[] = [];
  selectedEmployeeIds: number[] = [];
  
  taches = signal<Tache[]>([]);
  employes = signal<Employee[]>([]);
  tache: Tache = { 
    id: 0, 
    titre: '', 
    description: '', 
    dateEcheance: new Date(), 
    etatTache: EtatTache.EN_ATTENTE,
    employeIds: []
  };

   


  selectedTache!: Tache[] | null;
  tacheDialog: boolean = false;
  submitted: boolean = false;
  
  // États des tâches pour le dropdown
  etats = Object.values(EtatTache).map(etat => ({
    label: this.formatEtatLabel(etat),
    value: etat
  }));

  // Pour l'affectation d'employés
  selectedEmployeIds: number[] = [];
  employeOptions: any[] = [];
  
  cols!: Column[];
  exportColumns!: ExportColumn[];
  
  @ViewChild('dt') dt!: Table;
  
  constructor(
    private tacheService: TacheService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit() {
    this.loadTaches();
    this.loadEmployes();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'titre', header: 'Titre' },
      { field: 'description', header: 'Description' },
      { field: 'dateEcheance', header: 'Date d\'échéance' },
      { field: 'etatTache', header: 'État' }
    ];
    
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }
  
  loadTaches() {
    this.tacheService.getAllTaches().subscribe(data => {
      this.taches.set(data);
      console.log('Tâches chargées:', this.taches());
    });
  }
  
  loadEmployes() {
    this.authService.getAllemploye().subscribe(data => {
      this.employes.set(data);
      
      this.employeOptions = data.map(emp => ({
        label: `${emp.prenom} ${emp.nom} (${emp.matricule})`,
        value: emp.id
      }));
      
      console.log('Employés chargés:', this.employeOptions);
    });
  }
  
  formatEtatLabel(etat: string): string {
    return etat
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  openNew() {
    this.tache = {
      id: 0,
      titre: '',
      description: '',
      dateEcheance: new Date(),
      etatTache: EtatTache.EN_ATTENTE,
      employeIds: []
    };
    this.selectedEmployeIds = [];
    this.submitted = false;
    this.tacheDialog = true;
  }
  
  editTache(tache: Tache) {
    this.tache = { ...tache };
    this.selectedEmployeIds = this.tache.employeIds || [];
    this.tacheDialog = true;
  }
  
  deleteTache(tache: Tache) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer la tâche "' + tache.titre + '" ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tacheService.deleteTache(tache.id).subscribe({
          next: () => {
            this.taches.set(this.taches().filter(t => t.id !== tache.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Tâche supprimée',
              life: 3000
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la suppression de la tâche',
              life: 3000
            });
            console.error('Erreur lors de la suppression de la tâche:', err);
          }
        });
      }
    });
  }
  
  hideDialog() {
    this.tacheDialog = false;
    this.submitted = false;
  }
  








  
  saveTache() {
    this.submitted = true;
    
    if (this.tache.titre.trim()) {
      this.tache.employeIds = this.selectedEmployeIds;
      
      if (this.tache.id) {
        // Mise à jour d'une tâche existante
        this.tacheService.updateTache(this.tache.id, this.tache).subscribe({
          next: (updatedTache) => {
            // Mise à jour du tableau local
            const index = this.findIndexById(this.tache.id);
            if (index !== -1) {
              const updatedTaches = [...this.taches()];
              updatedTaches[index] = updatedTache;
              this.taches.set(updatedTaches);
            }
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Tâche mise à jour',
              life: 3000
            });
            this.tacheDialog = false;
            this.loadTaches(); // Recharger la liste pour avoir les données à jour
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la mise à jour de la tâche',
              life: 3000
            });
            console.error('Erreur lors de la mise à jour de la tâche:', err);
          }
        });
      } else {
        // Création d'une nouvelle tâche
         const dto: Tachesempdto = {
      tache: this.tache,
      idEmps: this.selectedEmployeeIds
    };

        this.tacheService.saveTache(dto).subscribe({
          next: (newTache) => {
            
            this.taches.set([...this.taches(), newTache]);
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Tâche créée',
              life: 3000
            });
            this.tacheDialog = false;
            this.loadTaches(); // Recharger la liste pour avoir les données à jour
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la création de la tâche',
              life: 3000
            });
            console.error('Erreur lors de la création de la tâche:', err);
          }
        });
      }
    }
  }
  
  updateEtat(tache: Tache, etat: EtatTache) {
    this.tacheService.updateEtat(tache.id, etat).subscribe({
      next: () => {
        // Mise à jour locale
        const index = this.findIndexById(tache.id);
        if (index !== -1) {
          const updatedTaches = [...this.taches()];
          updatedTaches[index].etatTache = etat;
          this.taches.set(updatedTaches);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `État de la tâche mis à jour: ${this.formatEtatLabel(etat)}`,
          life: 3000
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de la mise à jour de l\'état',
          life: 3000
        });
        console.error('Erreur lors de la mise à jour de l\'état:', err);
      }
    });
  }
  
  affecterEmployes(tache: Tache) {
    this.tache = { ...tache };
    this.selectedEmployeIds = this.tache.employeIds || [];
    
    // Ouvrir un dialog spécifique pour l'affectation
    this.tacheDialog = true;
  }
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  exportCSV() {
    this.dt.exportCSV();
  }
  
  findIndexById(id: number): number {
    return this.taches().findIndex(tache => tache.id === id);
  }
  
  getSeverity(etat: EtatTache): string {
    switch (etat) {
      case EtatTache.EN_ATTENTE:
        return 'warning';
      case EtatTache.EN_COURS:
        return 'info';
      case EtatTache.TERMINE:
        return 'success';
      default:
        return 'info';
    }
  }
  
  getProgress(etat: EtatTache): number {
    switch (etat) {
      case EtatTache.EN_ATTENTE:
        return 0;
      case EtatTache.EN_COURS:
        return 50;
      case EtatTache.TERMINE:
        return 100;
      default:
        return 0;
    }
  }


  /////
   saveTaches(): void {
    const dto: Tachesempdto = {
      tache: this.tache,
      idEmps: this.selectedEmployeeIds
    };

    this.tacheService.saveTache(dto).subscribe({
      next: (res) => {
        console.log('Tâche enregistrée avec succès', res);
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement', err);
      }
    });
  }
}
