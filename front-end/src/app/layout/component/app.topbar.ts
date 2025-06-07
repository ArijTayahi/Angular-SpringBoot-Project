import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { Observable, map } from 'rxjs';
import { NotificationService } from '../../services-gestion-ont/notifcation.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    StyleClassModule, 
    AppConfigurator, 
    BadgeModule, 
    MenuModule
  ],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-logo-container">
        <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
          <i class="pi pi-bars"></i>
        </button>
        <a class="layout-topbar-logo" routerLink="/">
          <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- SVG content remains unchanged -->
          </svg>
          <span>SAKAI</span>
        </a>
      </div>

      <div class="layout-topbar-actions">
        <div class="layout-config-menu">
          <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
            <i [ngClass]="{ 
              'pi': true, 
              'pi-moon': layoutService.isDarkTheme(), 
              'pi-sun': !layoutService.isDarkTheme() 
            }"></i>
          </button>
          <div class="relative">
            <button
              class="layout-topbar-action layout-topbar-action-highlight"
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
              <i class="pi pi-palette"></i>
            </button>
            <app-configurator />
          </div>
          
          <!-- Notification Button with Badge -->
          <div class="relative">
            <button
              class="layout-topbar-action"
              (click)="showNotificationMenu($event)"
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
              <i class="pi pi-bell" pBadge [value]="notificationCount$ | async"></i>
            </button>
            <p-menu 
              #notificationMenu 
              [model]="notificationItems" 
              [popup]="true" 
              styleClass="w-64"
              appendTo="body"
            >
              <ng-template pTemplate="header">
                <div class="p-2 font-bold flex justify-between items-center">
                  <span>Notifications</span>
                  <button 
                    *ngIf="notificationItems.length > 0"
                    pButton 
                    icon="pi pi-trash" 
                    class="p-button-text p-button-sm"
                    (click)="clearAllNotifications()"
                  ></button>
                </div>
              </ng-template>
              <ng-template pTemplate="item" let-item>
                <div class="p-2 border-bottom-1 surface-border">
                  <div class="font-medium">{{ item.label }}</div>
                  <small class="text-500">{{ item.timestamp | date: 'short' }}</small>
                </div>
              </ng-template>
              <ng-template pTemplate="empty">
                <div class="p-2 text-center">No notifications found</div>
              </ng-template>
            </p-menu>
          </div>
        </div>

        <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
          <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu hidden lg:block">
          <div class="layout-topbar-menu-content">
            <button type="button" class="layout-topbar-action">
              <i class="pi pi-calendar"></i>
              <span>Calendar</span>
            </button>
            <button type="button" class="layout-topbar-action">
              <i class="pi pi-inbox"></i>
              <span>Messages</span>
            </button>
            <button type="button" class="layout-topbar-action">
              <i class="pi pi-user"></i>
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppTopbar implements OnInit {
  notificationItems: MenuItem[] = [];
  notificationCount$: Observable<number>;

  constructor(
    public layoutService: LayoutService,
    private notificationService: NotificationService
  ) {
    this.notificationCount$ = this.notificationService.notificationCount$;
  }

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notificationItems = notifications.map(n => ({
        label: n.content,
        timestamp: n.timestamp,
        command: () => this.handleNotificationClick(n)
      }));
    });
  }

  showNotificationMenu(event: Event) {
    this.notificationService.clearNotificationCount();
    // Menu will show automatically via PrimeNG's popup binding
  }

  handleNotificationClick(notification: any) {
    console.log('Notification action:', notification);
    // Add your notification click logic here
    // Example: navigate to related page or mark as read
  }

  clearAllNotifications() {
    this.notificationService.clearAllNotifications();
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ 
      ...state, 
      darkTheme: !state.darkTheme 
    }));
  }
}