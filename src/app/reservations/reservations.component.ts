import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Reservation } from './reservation-card/reservation.interface';
import { ReservationCardComponent } from './reservation-card/reservation-card.component';
import { ReservationsService } from './reservations.service';
import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReservationCardComponent,
    RouterModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent {
  public reservations$ = new BehaviorSubject<Reservation[] | null>(null);
  
  constructor(public reservationService: ReservationsService) {
    this.reservationService.readReservationsFromFirestore();
  }
}
