import { Component, OnInit, inject } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
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
