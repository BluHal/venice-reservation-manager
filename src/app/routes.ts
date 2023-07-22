import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./reservations/reservations.component').then(
        (mod) => mod.ReservationsComponent
      ),
  },
];
