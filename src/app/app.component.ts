import { Component, inject } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavBarComponent, RouterModule],
})
export class AppComponent {
  title = 'venice-reservation-manager';

  constructor() {}
}
