import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SharedService } from './shared/shared.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ProgrammeService } from './shared/services/programme.service';
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
    SidenavComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'venice-reservation-manager';

  public showSpinner$ = this.sharedService.showSpinner$;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private programmeService: ProgrammeService
  ) {}

  ngOnInit() {
    this.showSpinner$.next(this.sharedService.getSpinnerStatus());
    if (!this.sharedService.checkUserData()) {
      this.router.navigateByUrl('/log-in');
    }
  }

  testGetProgramme(): void {
    this.programmeService
      .getProgrammeByDate('2023-08-30')
      .subscribe((res: any) => {
        console.log(res);
        const htmlString = res[1].data;
        this.programmeService.getEventsList(htmlString);
      });
  }
}
