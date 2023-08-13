import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input() drawer?: MatDrawer;
  @ViewChild('sidenavBtn', { static: false }) sidenavBtn?: ElementRef;

  onSidenavClick(): void {
    this.drawer?.toggle();
    console.log(this.drawer?.opened);
  }
}
