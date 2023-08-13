import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SharedService } from './shared/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    RouterModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'venice-reservation-manager';

  public showSpinner$ = this.sharedService.showSpinner$;

  constructor(private sharedService: SharedService, private router: Router) {}

  ngOnInit() {
    this.showSpinner$.next(this.sharedService.getSpinnerStatus());
    if (!this.sharedService.checkUserData()) {
      this.router.navigateByUrl('/log-in');
    }
  }
}
