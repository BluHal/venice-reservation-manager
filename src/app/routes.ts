import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'home',
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
  {
    path: 'log-in',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (mod) => mod.LoginPageComponent
      ),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
