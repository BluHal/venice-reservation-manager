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
export class ReservationsComponent implements OnInit {
  public reservations$ = new BehaviorSubject<Reservation[] | null>(null);

  private reservations: Reservation[] = [
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00',
      id: '04470c11-f0c2-4b62-a33e-553ebe32f318',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00',
      id: 'f37b606a-ed8f-4617-bd07-bfd14a3603bc',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00',
      id: 'f37b606a-ed8f-4617-bd07-bfd14a3603bc',
    },
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00',
      id: 'f37b606a-ed8f-4617-bd07-bfd14a3603bc',
    },
  ];

  constructor(private reservationService: ReservationsService) {}

  ngOnInit() {
    this.reservationService.setReservations(this.reservations);
    this.reservations$.next(this.reservationService.getReservations());
  }
}
