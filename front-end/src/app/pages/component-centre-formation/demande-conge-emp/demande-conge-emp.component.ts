import { Component, OnInit, signal } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { DemandeCongeEmpService } from '../../../services-gestion-ont/demande-conge-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
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

export interface DemandeConge {
  id?: number;
  dateDebut: Date;
  dateFin: Date;
  type: string;
  statut: string;
  nombreJoursOuvres?: number;
}

@Component({
  selector: 'app-demande-conge-emp',
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
      ConfirmDialogModule,
      CalendarModule,
      DropdownModule],
  templateUrl: './demande-conge-emp.component.html',
  styleUrl: './demande-conge-emp.component.scss',
  providers: [MessageService, DemandeCongeEmpService, ConfirmationService],
})
export class DemandeCongeEmpComponent implements OnInit {

  // Signals pour la réactivité
  demandes = signal<DemandeConge[]>([]);
  
  // Variables pour les dialogues
  demandeDialog = false;
  submitted = false;
  submittedAddNew = false;
  submittedUpdate = false;
  
  // Date actuelle pour minDate - FIXED: Create property instead of using new Date() in template
  currentDate = new Date();
  today = new Date(); // Alternative property name for clarity
  
  // Demande sélectionnée
  demande: DemandeConge = {
    dateDebut: new Date(),
    dateFin: new Date(),
    type: 'ANNUEL',
    statut: 'EN_ATTENTE'
  };
  
  selectedDemandes: DemandeConge[] = [];
  
  // Colonnes du tableau
  cols = [
    { field: 'id', header: 'ID' },
    { field: 'dateDebut', header: 'Date début' },
    { field: 'dateFin', header: 'Date fin' },
    { field: 'type', header: 'Type' },
    { field: 'statut', header: 'Statut' }
  ];

  // Options pour le type de congé
  typeCongeOptions = [
    { label: 'Congé Annuel', value: 'ANNUEL' },
    { label: 'Congé Maladie', value: 'MALADIE' },
    { label: 'Congé Maternité', value: 'MATERNITE' },
    { label: 'Congé Sans Solde', value: 'SANS_SOLDE' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private demandeCongeEmpService: DemandeCongeEmpService
  ) {}

  ngOnInit() {
    this.loadDemandesConge();
  }

  // ADDED: Method to get minimum date for calendar (ensures it's always current)
  getMinDate(): Date {
    return new Date();
  }

  // ADDED: Method to get minimum date for end date calendar
  getMinEndDate(): Date {
    return this.demande.dateDebut || new Date();
  }

  // Charger l'historique des demandes de congé de l'employé connecté
  loadDemandesConge() {
    this.demandeCongeEmpService.historiqueConges().subscribe({
      next: (data: DemandeConge[]) => {
        console.log('Données reçues:', data); // Debug log
        this.demandes.set(data);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des demandes'
        });
      }
    });
  }

  // Ouvrir le dialogue pour créer une nouvelle demande
  openNew() {
    this.demande = {
      dateDebut: new Date(),
      dateFin: new Date(),
      type: 'ANNUEL',
      statut: 'EN_ATTENTE'
    };
    this.submitted = false;
    this.submittedAddNew = true;
    this.submittedUpdate = false;
    this.demandeDialog = true;
  }

  // Modifier une demande existante (seulement si EN_ATTENTE)
  editDemande(demande: DemandeConge) {
    if (demande.statut !== 'EN_ATTENTE') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Seules les demandes en attente peuvent être modifiées'
      });
      return;
    }
    
    this.demande = { ...demande };
    this.submitted = false;
    this.submittedAddNew = false;
    this.submittedUpdate = true;
    this.demandeDialog = true;
  }

  // Supprimer une demande (seulement si EN_ATTENTE)
  deleteDemande(demande: DemandeConge) {
    if (demande.statut !== 'EN_ATTENTE') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Seules les demandes en attente peuvent être supprimées'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette demande ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeCongeEmpService.supprimerDemande(demande.id).subscribe({
          next: () => {
            this.loadDemandesConge();
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Demande supprimée avec succès'
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression'
            });
          }
        });
      }
    });
  }

  // Supprimer plusieurs demandes sélectionnées
  deleteSelectedDemandes() {
    const demandesNonModifiables = this.selectedDemandes.filter(d => d.statut !== 'EN_ATTENTE');
    
    if (demandesNonModifiables.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Seules les demandes en attente peuvent être supprimées'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les demandes sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedDemandes.map(demande => 
          this.demandeCongeEmpService.supprimerDemande(demande.id).toPromise()
        );

        Promise.all(deletePromises).then(() => {
          this.loadDemandesConge();
          this.selectedDemandes = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Demandes supprimées avec succès'
          });
        }).catch(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la suppression'
          });
        });
      }
    });
  }

  // Sauvegarder une demande (création ou modification)
  saveDemande() {
    this.submitted = true;

    if (!this.demande.dateDebut || !this.demande.dateFin || !this.demande.type) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    if (this.demande.dateDebut > this.demande.dateFin) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'La date de début doit être antérieure à la date de fin'
      });
      return;
    }

    if (this.submittedAddNew) {
      this.demandeCongeEmpService.creerDemande(this.demande).subscribe({
        next: (response: DemandeConge) => {
          this.loadDemandesConge();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Demande créée avec succès'
          });
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Erreur lors de la création de la demande'
          });
        }
      });
    } else if (this.submittedUpdate) {
      this.demandeCongeEmpService.modifierDemande(this.demande.id, this.demande).subscribe({
        next: (response: DemandeConge) => {
          this.loadDemandesConge();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Demande modifiée avec succès'
          });
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Erreur lors de la modification de la demande'
          });
        }
      });
    }
  }

  // Fermer le dialogue
  hideDialog() {
    this.demandeDialog = false;
    this.submitted = false;
    this.submittedAddNew = false;
    this.submittedUpdate = false;
  }

  // Filtrage global du tableau
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Formater les dates pour l'affichage
  formatDate(date: Date | string): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  // FIXED: Obtenir la sévérité du statut pour l'affichage - Return proper PrimeNG Tag severity types
  getSeverity(statut: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (statut) {
      case 'VALIDEE':
      case 'APPROUVEE':
        return 'success';
      case 'REJETEE':
      case 'REFUSEE':
        return 'danger';
      case 'EN_ATTENTE':
      case 'PENDING':
        return 'warn';
      case 'ANNULEE':
        return 'secondary';
      default:
        return 'info';
    }
  }

  // ADDED: Method to get readable status text
  getStatusText(statut: string): string {
    switch (statut) {
      case 'VALIDEE':
      case 'APPROUVEE':
        return 'Validée';
      case 'REJETEE':
      case 'REFUSEE':
        return 'Rejetée';
      case 'EN_ATTENTE':
      case 'PENDING':
        return 'En attente';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return statut;
    }
  }

  // ADDED: Method to get readable type text
  getTypeText(type: string): string {
    switch (type) {
      case 'ANNUEL':
        return 'Congé Annuel';
      case 'MALADIE':
        return 'Congé Maladie';
      case 'MATERNITE':
        return 'Congé Maternité';
      case 'SANS_SOLDE':
        return 'Congé Sans Solde';
      default:
        return type;
    }
  }

  // Exporter en CSV
  exportCSV() {
    const dataToExport = this.demandes().map(demande => ({
      'ID': demande.id,
      'Date de début': this.formatDate(demande.dateDebut),
      'Date de fin': this.formatDate(demande.dateFin),
      'Type': this.getTypeText(demande.type),
      'Statut': this.getStatusText(demande.statut),
      'Nombre de jours': demande.nombreJoursOuvres || 0
    }));

    const csvContent = this.convertToCSV(dataToExport);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `mes_congés_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Convertir les données en format CSV
  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvArray = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvArray.push(values.join(','));
    }
    
    return csvArray.join('\n');
  }

  // Vérifier si une demande peut être modifiée/supprimée
  canModifyOrDelete(demande: DemandeConge): boolean {
    return demande.statut === 'EN_ATTENTE';
  }
}