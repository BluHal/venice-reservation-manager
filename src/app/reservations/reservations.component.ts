import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Reservation } from './reservation-card/reservation.interface';
import { ReservationCardComponent } from './reservation-card/reservation-card.component';
import { ReservationsService } from './reservations.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReservationCardComponent,
    RouterModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  public reservations$ = new BehaviorSubject<Reservation[] | null>(null);
  public selectedDateRange$ = new BehaviorSubject<Date[]>([
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(0, 0, 0, 0)),
  ]);
  public filterDate = new FormGroup({
    start: new FormControl<Date>(new Date(new Date().setHours(0, 0, 0, 0))),
    end: new FormControl<Date>(new Date(new Date().setHours(0, 0, 0, 0))),
  });

  constructor(public reservationService: ReservationsService) {
    this.reservationService.readReservations();
  }

  ngOnInit(): void {
    this.selectedDateRange$ = this.reservationService.selectedDateRange$;
  }

  onDateChanged(): void {
    const startDate = this.filterDate.value.start || new Date();
    const endDate = this.filterDate.value.end || new Date();
    this.selectedDateRange$.next([startDate, endDate]);
    this.reservationService.readReservations();
  }

  setSelectedDate(type: string): void {
    let startDate = this.filterDate.value.start || new Date();
    let endDate = this.filterDate.value.end || new Date();

    switch (type) {
      case 'today':
        this.filterDate.patchValue({
          start: new Date(new Date().setHours(0, 0, 0, 0)),
          end: new Date(new Date().setHours(0, 0, 0, 0)),
        });
        break;
      case 'next':
        let nextStartDate = new Date(startDate);
        nextStartDate.setDate(nextStartDate.getDate() + 1);
        let nextEndDate = new Date(endDate);
        nextEndDate.setDate(nextEndDate.getDate() + 1);
        this.filterDate.patchValue({
          start: new Date(nextStartDate),
          end: new Date(nextEndDate),
        });
        break;
      case 'prev':
        let prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - 1);
        let prevEndDate = new Date(endDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        this.filterDate.patchValue({
          start: new Date(prevStartDate),
          end: new Date(prevEndDate),
        });
        break;
    }

    this.onDateChanged();
  }
}
