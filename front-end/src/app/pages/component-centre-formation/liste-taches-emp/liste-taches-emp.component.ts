
// employee-task.component.ts
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { Tache } from '../../../models-gestion-ont/tache';
import { EtatTache } from '../../../models-gestion-ont/etat-tache';
import { TacheEmpService } from '../../../services-gestion-ont/tache-emp.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-liste-taches-emp',
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
    IconFieldModule,
    InputIconModule,
    TagModule,
    ProgressBarModule,
    CardModule,
    PanelModule
  ],
  templateUrl: './liste-taches-emp.component.html',
  providers: [MessageService]
})
export class ListeTachesEmpComponent implements OnInit {
   EtatTache = EtatTache;
  mesTaches = signal<Tache[]>([]);
  selectedTache: Tache | null = null;
  tacheDetailDialog: boolean = false;
  
  // États disponibles pour l'employé (uniquement EN_COURS et TERMINÉ)
  etatsEmploye = [
    { label: 'En cours', value: EtatTache.EN_COURS },
    { label: 'Terminé', value: EtatTache.TERMINE }
  ];
  
  cols!: Column[];
  currentEmployee: Employee | null = null;
  
  @ViewChild('dt') dt!: Table;
  
  constructor(
    private tacheService: TacheEmpService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.getCurrentEmployee();
    this.initializeColumns();
  }
  
getCurrentEmployee() {
  this.authService.getCurrentUser().subscribe({
    next: (user) => {
      console.log('Utilisateur récupéré:', user);
      this.currentEmployee = user;
      if (this.currentEmployee?.id) {
        this.loadMesTaches();
      }
    },
    error: (error) => {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Gérer l'erreur appropriée selon votre cas
      if (error.status === 401) {
        // Token expiré ou invalide
        this.authService.logout();
        // Rediriger vers la page de connexion
      }
    }
  });
}

  
  initializeColumns() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'titre', header: 'Titre' },
      { field: 'description', header: 'Description' },
      { field: 'dateEcheance', header: 'Date d\'échéance' },
      { field: 'etatTache', header: 'État' }
    ];
  }
  
  loadMesTaches() {
      this.tacheService.tachesParEmploye().subscribe({
        next: (data) => {
          this.mesTaches.set(data);
          console.log('Mes tâches chargées:', this.mesTaches());
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger vos tâches',
            life: 3000
          });
          console.error('Erreur lors du chargement des tâches:', err);
        }
      });
    
  }
  
  formatEtatLabel(etat: string): string {
    return etat
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  voirDetails(tache: Tache) {
    this.selectedTache = { ...tache };
    this.tacheDetailDialog = true;
  }
  
  marquerProgression(tache: Tache, nouvelEtat: EtatTache) {
    // Vérifier que l'employé ne peut que passer à EN_COURS ou TERMINÉ
    if (nouvelEtat !== EtatTache.EN_COURS && nouvelEtat !== EtatTache.TERMINE) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action non autorisée',
        detail: 'Vous ne pouvez marquer une tâche qu\'en cours ou terminée',
        life: 3000
      });
      return;
    }
    
    
    this.tacheService.updateEtat(tache.id, nouvelEtat).subscribe({
      next: () => {
        // Mise à jour locale
        const index = this.findIndexById(tache.id);
        if (index !== -1) {
          const updatedTaches = [...this.mesTaches()];
          updatedTaches[index].etatTache = nouvelEtat;
          this.mesTaches.set(updatedTaches);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Tâche marquée comme: ${this.formatEtatLabel(nouvelEtat)}`,
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
  
  hideDialog() {
    this.tacheDetailDialog = false;
    this.selectedTache = null;
  }
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  findIndexById(id: number): number {
    return this.mesTaches().findIndex(tache => tache.id === id);
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
  
  getStatutIcon(etat: EtatTache): string {
    switch (etat) {
      case EtatTache.EN_ATTENTE:
        return 'pi pi-clock';
      case EtatTache.EN_COURS:
        return 'pi pi-play';
      case EtatTache.TERMINE:
        return 'pi pi-check';
      default:
        return 'pi pi-info';
    }
  }
  
  refreshTaches() {
    this.loadMesTaches();
    this.messageService.add({
      severity: 'info',
      summary: 'Actualisation',
      detail: 'Liste des tâches actualisée',
      life: 2000
    });
  }
  
  // Statistiques pour l'employé
  getTachesStats() {
    const taches = this.mesTaches();
    return {
      total: taches.length,
      enAttente: taches.filter(t => t.etatTache === EtatTache.EN_ATTENTE).length,
      enCours: taches.filter(t => t.etatTache === EtatTache.EN_COURS).length,
      terminees: taches.filter(t => t.etatTache === EtatTache.TERMINE).length
    };
  }
  
  // Vérifier si une tâche est en retard
  isTaskOverdue(dateEcheance: Date): boolean {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    return echeance < today;
  }
  
  // Vérifier si une tâche approche de son échéance (dans les 3 prochains jours)
  isTaskDueSoon(dateEcheance: Date): boolean {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  }

  changerEtat(tache: Tache): void {
  console.log('Ancien état:', tache.etatTache);
  console.log('Nouvel état sélectionné:', tache.etatTache);
  
  // Validation de l'état
  if (!tache.etatTache) {
    console.warn('Aucun état sélectionné');
    return;
  }

} 
etatOptions = [
  { label: 'En attente', value: 'EN_ATTENTE' },
  { label: 'En cours', value: 'EN_COURS' },
  { label: 'Terminée', value: 'TERMINE' }
];

} 