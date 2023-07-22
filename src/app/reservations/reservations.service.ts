import { Injectable } from '@angular/core';
import { Reservation } from './reservation-card/reservation.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor() {}

  private reservations = new BehaviorSubject<Reservation[] | null>(null);

  public getReservations(): Reservation[] | null {
    return this.reservations.value;
  }

  public setReservations(reservations: Reservation[]) {
    this.reservations.next(reservations);
  }

  public deleteReservation(id: string): void {
    const index: number | undefined = this.reservations.value?.findIndex(
      (res) => res.id === id
    );

    if (index != undefined && index > -1)
      this.reservations.value?.splice(index, 1);
  }
}
