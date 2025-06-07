import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { TableModule, Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DemandeCongeService } from '../../../services-gestion-ont/demande-conge.service';
import { DemandeConge, DemandeCongesave, StatutDemande, TypeConge } from '../../../models-gestion-ont/demande-conge';

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
  selector: 'app-gestion-conge',
  templateUrl: './gestion-conge.component.html',
  styleUrl: './gestion-conge.component.scss',
  standalone: true,
  imports: [
    CommonModule,
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
    DropdownModule
  ],
  providers: [MessageService, DemandeCongeService, ConfirmationService, DatePipe],
})
export class GestionCongeComponent implements OnInit {

  demandeDialog: boolean = false;
  validationDialog: boolean = false;

  demandes = signal<DemandeConge[]>([]);

  demande: DemandeCongesave = this.initNewDemande();

  selectedDemandes!: DemandeConge[] | null;

  submitted: boolean = false;
  submittedAddNew: boolean = false;
  submittedUpdate: boolean = false;
  
  // Pour le dialogue de validation
  validationApprouve: boolean = true;

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];
  
  // Options pour le dropdown du type de congé
  typeCongeOptions = [
    { label: 'ANNUEL', value: TypeConge.ANNUEL },
    { label: 'MALADIE', value: TypeConge.MALADIE },
    { label: 'EXCEPTIONNEL', value: TypeConge.EXCEPTIONNEL },
    { label: 'MATERNITE', value: TypeConge.MATERNITE },
    { label: 'FORMATION', value: TypeConge.FORMATION }
  ];

  constructor(
    private demandeCongeService: DemandeCongeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe
  ) {}

  initNewDemande(): DemandeConge {
    return {
      id: 0,
      dateDebut: new Date(),
      dateFin: new Date(),
      statut: StatutDemande.EN_ATTENTE,
      type: TypeConge.ANNUEL,
      
    };
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    // Pour les admins/RH qui voient toutes les demandes
    this.demandeCongeService.toutesLesDemandes().subscribe((data) => {
      this.demandes.set(data);
      console.log("demandes", this.demandes());
    });

    /*
    // Pour un employé spécifique (décommentez si nécessaire)
    
    const employeId = 1; // À remplacer par l'ID de l'employé connecté
    this.demandeCongeService.historiqueCongesEmploye(employeId).subscribe((data) => {
      this.demandes.set(data);
      console.log("demandes", this.demandes());
    });*/
    

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'dateDebut', header: 'Date début' },
      { field: 'dateFin', header: 'Date fin' },
      { field: 'type', header: 'Type de congé' },
      { field: 'statut', header: 'Statut' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.demande = this.initNewDemande();
    this.submitted = false;
    this.demandeDialog = true;
    this.submittedAddNew = true;
    this.submittedUpdate = false;
  }

  editDemande(demande: DemandeConge) {
    this.demande = { ...demande };
    // Conversion des strings en Date si nécessaire
    if (typeof this.demande.dateDebut === 'string') {
      this.demande.dateDebut = new Date(this.demande.dateDebut);
    }
    if (typeof this.demande.dateFin === 'string') {
      this.demande.dateFin = new Date(this.demande.dateFin);
    }
    this.demandeDialog = true;
    console.log("editing", this.demande);
    this.submittedAddNew = false;
    this.submittedUpdate = true;
  }

  openValidationDialog(demande: DemandeConge) {
    this.demande = { ...demande };
    this.validationApprouve = true; // Par défaut, approuver
    this.validationDialog = true;
  }

  validerDemande() {
    this.demandeCongeService.validerDemande(this.demande.id, this.validationApprouve).subscribe({
      next: (updatedDemande) => {
        const index = this.findIndexById(this.demande.id);
        let demandesArray = this.demandes();
        if (index !== -1) {
          demandesArray[index] = updatedDemande;
          this.demandes.set([...demandesArray]);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Opération réussie',
          detail: `Demande ${this.validationApprouve ? 'approuvée' : 'rejetée'}`,
          life: 3000
        });
        
        this.validationDialog = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: `Échec lors de la ${this.validationApprouve ? 'validation' : 'rejet'} de la demande`,
          life: 3000
        });
        console.error('Erreur lors de la validation:', err);
      }
    });
  }

  deleteSelectedDemandes() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les demandes sélectionnées?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!this.selectedDemandes || this.selectedDemandes.length === 0) return;
        
        // Suppression de chaque demande sélectionnée
        let demandesActuelles = [...this.demandes()];
        let promises: Promise<void>[] = [];
        
        this.selectedDemandes.forEach(demande => {
          const promise = new Promise<void>((resolve, reject) => {
            this.demandeCongeService.supprimerDemande(demande.id).subscribe({
              next: () => {
                demandesActuelles = demandesActuelles.filter(d => d.id !== demande.id);
                resolve();
              },
              error: (err) => {
                console.error('Erreur lors de la suppression:', err);
                reject(err);
              }
            });
          });
          
          promises.push(promise);
        });
        
        // Une fois toutes les suppressions terminées
        Promise.all(promises)
          .then(() => {
            this.demandes.set(demandesActuelles);
            this.selectedDemandes = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Opération réussie',
              detail: 'Demandes supprimées',
              life: 3000
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Problème lors de la suppression',
              life: 3000
            });
          });
      }
    });
  }

  hideDialog() {
    this.demandeDialog = false;
    this.submitted = false;
  }

  hideValidationDialog() {
    this.validationDialog = false;
  }
  

  deleteDemande(demande: DemandeConge) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer la demande #' + demande.id + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeCongeService.supprimerDemande(demande.id).subscribe({
          next: () => {
            this.demandes.set(this.demandes().filter((val) => val.id !== demande.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Opération réussie',
              detail: 'Demande supprimée',
              life: 3000
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la suppression',
              life: 3000
            });
            console.error('Erreur lors de la suppression:', err);
          }
        });
      }
    });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.demandes().length; i++) {
      if (this.demandes()[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  saveDemande() {
    this.demande.dateDebut= this.datePipe.transform(this.demande.dateDebut, 'yyyy-MM-dd'),
      this.demande.dateFin= this.datePipe.transform(this.demande.dateFin, 'yyyy-MM-dd'),
    this.submitted = true;

    if (this.isFormValid()) {
      if (this.demande.id) {
        // Mise à jour d'une demande existante
        this.demandeCongeService.updateDemande(this.demande).subscribe({
          next: (updatedDemande) => {
            // Mise à jour locale
            let demandesArray = this.demandes();
            const index = this.findIndexById(this.demande.id);
            if (index !== -1) {
              demandesArray[index] = updatedDemande;
              this.demandes.set([...demandesArray]);
            }
            
            this.messageService.add({
              severity: 'success',
              summary: 'Opération réussie',
              detail: 'Demande mise à jour',
              life: 3000
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la mise à jour',
              life: 3000
            });
            console.error('Erreur lors de la mise à jour:', err);
          }
        });
      } else {
        // Création d'une nouvelle demande
        // L'ID de l'employé est déjà défini dans this.demande.employe.id
       // const employeId = this.demande.employe?.id || 1;
        console.log("hhhhhhh",this.demande)
        this.demandeCongeService.creerDemande(this.demande).subscribe({
          next: (newDemande) => {
            this.demandes.set([...this.demandes(), newDemande]);
            this.messageService.add({
              severity: 'success',
              summary: 'Opération réussie',
              detail: 'Demande créée',
              life: 3000
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la création',
              life: 3000
            });
            console.error('Erreur lors de la création:', err);
          }
        });
      }

      this.demandeDialog = false;
    }
  }
/////////




  isFormValid(): boolean {
    // Vérification que les dates sont valides et que la date de fin est après la date de début
    if (!this.demande.dateDebut || !this.demande.dateFin) {
      return false;
    }
    
    const debut = new Date(this.demande.dateDebut);
    const fin = new Date(this.demande.dateFin);
    
    if (isNaN(debut.getTime()) || isNaN(fin.getTime()) || fin < debut) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'La date de fin doit être postérieure à la date de début',
        life: 3000
      });
      return false;
    }
    
    // Le type de congé est requis
    if (!this.demande.type) {
      return false;
    }
    
    return true;
  }

  getSeverity(statut: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (statut) {
      case 'APPROUVEE':
        return 'success';
      case 'REJETEE':
        return 'danger';
      case 'EN_ATTENTE':
        return 'warn';
      default:
        return 'secondary'; // valeur par défaut valide
    }
  }
  
  // Formater la date pour l'affichage
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }
}