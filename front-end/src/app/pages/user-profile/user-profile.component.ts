import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { DialogModule } from "primeng/dialog"
import { InputTextModule } from "primeng/inputtext"
import { AvatarModule } from "primeng/avatar"
import { DividerModule } from "primeng/divider"
import { ToastModule } from "primeng/toast"
import { MessageService } from "primeng/api"
import { ProfilUserDto, UserProfileService } from "../../services-gestion-ont/user-profile.service"


@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    AvatarModule,
    DividerModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p class="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        <!-- Profile Card -->
        <p-card class="mb-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Avatar Section -->
            <div class="flex flex-col items-center lg:items-start">
              <p-avatar 
                [image]="userProfile?.avatar || '/placeholder.svg?height=120&width=120'" 
                size="xlarge" 
                shape="circle"
                class="mb-4">
              </p-avatar>
              <button 
                pButton 
                type="button" 
                label="Changer la photo" 
                icon="pi pi-camera"
                class="p-button-outlined p-button-sm">
              </button>
            </div>

            <!-- User Info -->
            <div class="flex-1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <div class="text-lg font-semibold text-gray-900">
                    {{userProfile?.prenom}} {{userProfile?.nom}}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div class="text-lg text-gray-900">{{userProfile?.email}}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div class="text-lg text-gray-900">{{userProfile?.tlf || 'Non renseigné'}}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div class="text-lg text-gray-900">{{userProfile?.adresse || 'Non renseignée'}}</div>
                </div>
              </div>
              
              <p-divider></p-divider>
              
              <div class="flex gap-3">
                <button 
                  pButton 
                  type="button" 
                  label="Modifier le profil" 
                  icon="pi pi-pencil"
                  class="p-button-primary"
                  (click)="openEditDialog()">
                </button>
                <button 
                  pButton 
                  type="button" 
                  label="Changer le mot de passe" 
                  icon="pi pi-key"
                  class="p-button-outlined">
                </button>
              </div>
            </div>
          </div>
        </p-card>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p-card>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">24</div>
              <div class="text-gray-600">Projets actifs</div>
            </div>
          </p-card>
          
          <p-card>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">156</div>
              <div class="text-gray-600">Tâches terminées</div>
            </div>
          </p-card>
          
          <p-card>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 mb-2">89%</div>
              <div class="text-gray-600">Taux de réussite</div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Edit Profile Dialog -->
      <p-dialog 
        header="Modifier le profil" 
        [(visible)]="displayEditDialog" 
        [modal]="true" 
        [style]="{width: '500px'}"
        [closable]="true"
        [draggable]="false"
        [resizable]="false">
        
        <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="prenom" class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input 
                  pInputText 
                  id="prenom" 
                  name="prenom"
                  [(ngModel)]="editProfile.prenom" 
                  required
                  class="w-full"
                  placeholder="Votre prénom">
              </div>
              
              <div>
                <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input 
                  pInputText 
                  id="nom" 
                  name="nom"
                  [(ngModel)]="editProfile.nom" 
                  required
                  class="w-full"
                  placeholder="Votre nom">
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input 
                pInputText 
                id="email" 
                name="email"
                type="email"
                [(ngModel)]="editProfile.email" 
                required
                class="w-full"
                placeholder="votre.email@exemple.com">
            </div>
            
            <div>
              <label for="tlf" class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input 
                pInputText 
                id="tlf" 
                name="tlf"
                [(ngModel)]="editProfile.tlf" 
                class="w-full"
                placeholder="+33 1 23 45 67 89">
            </div>
            
            <div>
              <label for="adresse" class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input 
                pInputText 
                id="adresse" 
                name="adresse"
                [(ngModel)]="editProfile.adresse" 
                class="w-full"
                placeholder="Votre adresse complète">
            </div>
          </div>
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              pButton 
              type="button" 
              label="Annuler" 
              icon="pi pi-times"
              class="p-button-text"
              (click)="closeEditDialog()">
            </button>
            <button 
              pButton 
              type="submit" 
              label="Enregistrer" 
              icon="pi pi-check"
              class="p-button-primary"
              [disabled]="!profileForm.form.valid || isLoading">
            </button>
          </div>
        </form>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  userProfile: ProfilUserDto | null = null
  editProfile: ProfilUserDto
   = {
    id: 0,
    nom: "",
    prenom: "",
    tlf: "",
    adresse: "",
    email: "",
    avatar: "",
  }
  displayEditDialog = false
  isLoading = false

  constructor(
    private userProfileService: UserProfileService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadUserProfile()
  }

  loadUserProfile() {
    this.userProfileService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger le profil utilisateur",
        })
      },
    })
  }

  openEditDialog() {
    if (this.userProfile) {
      this.editProfile = { ...this.userProfile }
      this.displayEditDialog = true
    }
  }

  closeEditDialog() {
    this.displayEditDialog = false
    this.editProfile = {
      id: 0,
      nom: "",
      prenom: "",
      tlf: "",
      adresse: "",
      email: "",
      avatar: "",
    }
  }

  updateProfile() {
    this.isLoading = true

    this.userProfileService.updateUserProfile(this.editProfile).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile
        this.displayEditDialog = false
        this.isLoading = false
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Profil mis à jour avec succès",
        })
      },
      error: (error) => {
        this.isLoading = false
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de mettre à jour le profil",
        })
      },
    })
  }
}
