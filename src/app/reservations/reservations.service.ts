import { Injectable, inject } from '@angular/core';
import { Reservation } from './reservation-card/reservation.interface';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import {  CollectionReference, DocumentReference, Firestore, Query, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor() {}

  
  public reservations$?: Observable<Reservation[]>;

  private firestore: Firestore = inject(Firestore);
  private reservations = new BehaviorSubject<Reservation[] | null>(null); 
  private reservationsCollection = collection(this.firestore, 'reservations');

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

  public readReservationsFromFirestore(): void {
    this.reservations$ = collectionData(this.reservationsCollection, {idField: 'id'}) as Observable<Reservation[]>;
    this.reservations$ = this.reservations$.pipe(
      map(res => {
        return res.sort((a, b) => (a.dateTime?.seconds || 0) - (b.dateTime?.seconds || 0))
      }),
      tap(res => console.log(res)),
    )
  }

  public createReservationInFirestore(reservation: Reservation): void {
    if(!reservation) return;

    addDoc(this.reservationsCollection, reservation ).then((documentReference: DocumentReference) => {
      console.log(documentReference);
      
    })
  }

  public deleteReservationInFirestore(reservationId: string): void { 
    deleteDoc(doc(this.firestore, `reservations/${reservationId}`));
  }
}
