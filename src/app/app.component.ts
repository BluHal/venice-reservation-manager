import { Component, OnInit, inject } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
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

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.showSpinner$.next(this.sharedService.getSpinnerStatus());
  }
}
