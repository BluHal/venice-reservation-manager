import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./reservations/reservations.component').then(
        (mod) => mod.ReservationsComponent
      ),
  },
  {
    path: 'insert-reservation',
    loadComponent: () =>
      import(
        './reservations/reservation-insert/reservation-insert.component'
      ).then((mod) => mod.ReservationInsertComponent),
  },
];
