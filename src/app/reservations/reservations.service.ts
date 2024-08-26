import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  Timestamp,
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
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import {
  Reservation,
  ReservationsStorage,
} from './reservation-card/reservation.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private sharedService: SharedService) {}

  public reservations$?: Observable<Reservation[]>;
  public reservationFile$?: Observable<string>;
  public selectedDateRange$ = new BehaviorSubject<Date[]>([
    new Date(),
    new Date(),
  ]);

  private firestore: Firestore = inject(Firestore);
  private reservations = new BehaviorSubject<Reservation[] | null>(null);
  private reservationsCollection = collection(this.firestore, 'reservations');
  private reservationFileCollection = collection(
    this.firestore,
    'reservation_files'
  );
  private storageKey = 'storedReservations';

  public getReservations(): Reservation[] | null {
    return this.reservations.value;
  }

  public setReservations(reservations: Reservation[]) {
    this.reservations.next(reservations);
  }

  public readReservations(): void {
    const localStorageReservations = this.readReservationsFromLocalStorage();
    if (localStorageReservations.length > 0) {
      this.reservations$ = of(localStorageReservations);
    } else {
      this.readReservationsFromFirestore();
    }
  }

  public readReservationsFromFirestore(): void {
    this.sharedService.activateSpinner();

    const startDate = Timestamp.fromDate(this.selectedDateRange$.value[0]);
    var endDate = new Date(this.selectedDateRange$.value[1]);
    endDate.setDate(endDate.getDate() + 1);
    const endDateTimeStamp = Timestamp.fromDate(endDate);

    const q = query(
      this.reservationsCollection,
      where('uid', '==', this.sharedService.getUserId()),
      where('dateTime', '>=', startDate),
      where('dateTime', '<', endDateTimeStamp),
      orderBy('dateTime', 'asc')
    );

    try {
      this.reservations$ = collectionData(q, {
        idField: 'id',
      }) as Observable<Reservation[]>;
      this.sharedService.disableSpinner();
    } catch (error) {
      console.error('READ ERROR', error);
      this.sharedService.disableSpinner();
    }
  }

  public readReservationFile(
    reservationId: string,
    localStorageId: string
  ): void {
    try {
      const localStorageReservationFileContent =
        this.readReservationFileFromLocalStorage(localStorageId);
      if (localStorageReservationFileContent != '') {
        this.reservationFile$ = of<string>(localStorageReservationFileContent);
      } else {
        this.readReservationFileFromFirestore(reservationId);
      }
    } catch (e) {
      this.readReservationFileFromFirestore(reservationId);
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

  public async createReservationInFirestore(
    reservation: Reservation
  ): Promise<string> {
    if (!reservation) return '';

    const reservationFileContent = reservation.fileContent;

    reservation.fileContent = '';

    const docRef: DocumentReference = await addDoc(
      this.reservationsCollection,
      reservation
    );
    this.createReservationFileInFirestore(reservationFileContent, docRef.id);

    return docRef.id;
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
        //console.log(documentReference);
      }
    );
  }

  public deleteReservation(reservationId: string): void {
    if (!reservationId) return;
    this.deleteReservationFromLocalStorage(reservationId);
    this.deleteReservationInFirestore(reservationId);
    this.reservations$ = of(this.readReservationsFromLocalStorage());
  }

  public deleteReservationInFirestore(reservationId: string): void {
    const q = query(
      this.reservationFileCollection,
      where('reservationId', '==', reservationId)
    );

    getDocs(q).then((qDocs: any) => {
      try {
        const fileContentDocId = qDocs.docs[0].id;
        deleteDoc(
          doc(this.firestore, `/reservation_files/${fileContentDocId}`)
        );
      } catch (error) {
        console.error('DELETE FILE ERROR', error);
      }
      try {
        deleteDoc(doc(this.firestore, `reservations/${reservationId}`));
      } catch (error) {
        console.error('DELETE RESERVATION ERROR', error);
      }
    });
  }

  public saveReservationToLocalStorage(reservation: Reservation): void {
    const localStorageReservationsString = localStorage.getItem(
      this.storageKey
    );
    if (localStorageReservationsString) {
      const localReservationStorage: ReservationsStorage = JSON.parse(
        localStorageReservationsString
      );
      localReservationStorage.reservations.push(reservation);
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(localReservationStorage)
      );
    } else {
      const localReservationStorage: ReservationsStorage = {
        date: new Date(),
        reservations: [reservation],
      };
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(localReservationStorage)
      );
    }
  }

  public readReservationsFromLocalStorage(): Reservation[] {
    const localStorageReservationsString = localStorage.getItem(
      this.storageKey
    );

    if (!localStorageReservationsString) return [];

    var startDate = new Date(this.selectedDateRange$.value[0]);
    startDate.setHours(0, 0, 0, 0);
    const startDateTimeStamp = Timestamp.fromDate(startDate);
    var endDate = new Date(this.selectedDateRange$.value[1]);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);
    const endDateTimeStamp = Timestamp.fromDate(endDate);

    const localReservationStorage: ReservationsStorage = JSON.parse(
      localStorageReservationsString
    );

    return localReservationStorage.reservations
      .filter(
        (reservation) =>
          reservation?.dateTime &&
          reservation.dateTime.seconds >= startDateTimeStamp.seconds &&
          reservation.dateTime.seconds < endDateTimeStamp.seconds
      )
      .sort((a, b) => {
        if (!a.dateTime || !b.dateTime) return 0;
        return a.dateTime.seconds - b.dateTime.seconds;
      });
  }

  public readReservationFileFromLocalStorage(localStorageId: string): string {
    const localStorageReservationsString = localStorage.getItem(
      this.storageKey
    );

    if (!localStorageReservationsString) return '';

    const localReservationStorage: ReservationsStorage = JSON.parse(
      localStorageReservationsString
    );

    const reservationById = localReservationStorage.reservations.filter(
      (reservation) => reservation.localStorageId === localStorageId
    )[0];

    return reservationById.fileContent;
  }

  public checkReservationLocalStorageDate(): void {
    const localStorageReservationsString = localStorage.getItem(
      this.storageKey
    );

    if (localStorageReservationsString) {
      const localReservationStorage: ReservationsStorage = JSON.parse(
        localStorageReservationsString
      );
      const currentDate = new Date();
      const localStorageDate = new Date(localReservationStorage.date);
      if (
        currentDate.getMonth() > localStorageDate.getMonth() ||
        currentDate.getDate() > localStorageDate.getDate()
      ) {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify({
            date: currentDate,
            reservations: localReservationStorage.reservations.filter(
              (reservation) =>
                reservation.dateTime &&
                Math.floor(currentDate.getTime() / 1000) <=
                  reservation.dateTime?.seconds
            ),
          })
        );
      }
    } else {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({ date: new Date(), reservations: [] })
      );
    }
  }

  public deleteReservationFromLocalStorage(id: string): void {
    const localStorageReservationsString = localStorage.getItem(
      this.storageKey
    );

    if (!localStorageReservationsString) return;

    const localReservationStorage: ReservationsStorage = JSON.parse(
      localStorageReservationsString
    );

    localReservationStorage.reservations =
      localReservationStorage.reservations.filter(
        (reservation) => reservation.id !== id
      );

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(localReservationStorage)
    );
  }
}
