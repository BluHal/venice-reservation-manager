import { Timestamp } from "@angular/fire/firestore";

export interface Reservation {
  movieTitle: string;
  dateTime?: Timestamp;
  location: string;
  fileContent: string;
  id?: string;
  uid: string;
}
