import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Reservation } from './reservation-card/reservation.interface';
import { ReservationCardComponent } from './reservation-card/reservation-card.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReservationCardComponent,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent {
  public reservations?: Reservation[] = [
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00:00',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00:00',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00:00',
    },
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00:00',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00:00',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00:00',
    },
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00:00',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00:00',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00:00',
    },
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00:00',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00:00',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00:00',
    },
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00:00',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00:00',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00:00',
    },
    {
      movieTitle: 'The godfather',
      date: '30/08/2023 15:00:00',
    },
    {
      movieTitle: 'The Lord of the Rings',
      date: '30/08/2023 20:00:00',
    },
    {
      movieTitle: 'Dune part two',
      date: '30/08/2023 09:00:00',
    },
  ];
}
