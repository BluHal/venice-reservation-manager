import { Injectable, inject } from '@angular/core';
import { Reservation } from './reservation-card/reservation.interface';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  Query,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private sharedService: SharedService) {}

  public reservations$?: Observable<Reservation[]>;
  public reservationFile$?: Observable<string>;

  private firestore: Firestore = inject(Firestore);
  private reservations = new BehaviorSubject<Reservation[] | null>(null);
  private reservationsCollection = collection(this.firestore, 'reservations');
  private reservationFileCollection = collection(
    this.firestore,
    'reservation_files'
  );

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
    this.sharedService.activateSpinner();

    const q = query(
      this.reservationsCollection,
      where('uid', '==', this.sharedService.getUserId()),
      orderBy('dateTime', 'asc')
    );

    try {
      this.reservations$ = collectionData(q, {
        idField: 'id',
      }) as Observable<Reservation[]>;
      this.reservations$ = this.reservations$.pipe(
        tap((res) => console.log(res))
      );
      this.sharedService.disableSpinner();
    } catch (error) {
      console.error('READ ERROR', error);
      this.sharedService.disableSpinner();
    }
  }

  public readReservationFileFromFirestore(reservationId: string): void {
    this.sharedService.activateSpinner();
    const q = query(
      this.reservationFileCollection,
      where('reservationId', '==', reservationId)
    );

    try {
      this.reservationFile$ = collectionData(q, {
        idField: 'id',
      }).pipe(map((res) => res[0]['fileContent'])) as Observable<string>;
      this.sharedService.disableSpinner();
    } catch (error) {
      console.error('READ FILE ERROR', error);
      this.sharedService.disableSpinner();
    }
  }

  public createReservationInFirestore(reservation: Reservation): void {
    if (!reservation) return;

    const reservationFileContent = reservation.fileContent;

    reservation.fileContent = '';

    addDoc(this.reservationsCollection, reservation).then(
      (documentReference: DocumentReference) => {
        this.createReservationFileInFirestore(
          reservationFileContent,
          documentReference.id
        );
      }
    );
  }

  public createReservationFileInFirestore(
    fileContent: string,
    reservationId: string
  ): void {
    const reservationFile = {
      fileContent: fileContent,
      reservationId: reservationId,
    };

    addDoc(this.reservationFileCollection, reservationFile).then(
      (documentReference: DocumentReference) => {
        console.log(documentReference);
      }
    );
  }

  public deleteReservationInFirestore(reservationId: string): void {
    deleteDoc(doc(this.firestore, `reservations/${reservationId}`));
  }
}
