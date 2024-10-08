import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import * as moment from 'moment';
import { PdfConversionService } from 'src/app/shared/pdf-conversion.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Reservation } from '../reservation-card/reservation.interface';
import { ReservationsService } from '../reservations.service';

@Component({
  selector: 'app-reservation-insert',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reservation-insert.component.html',
  styleUrls: ['./reservation-insert.component.scss'],
})
export class ReservationInsertComponent implements OnInit {
  private date?: Date | null;
  private time: string = '';
  private dateTime?: Date;
  private formatDate: string = '';
  private formatTime: string = '';
  private formatDateTime: string = '';

  private selectedFile: any;
  private selectedFileContent: string = '';
  public hasFile = false;
  private ticketText: string = '';

  public reservationForm = this.fb.group({
    location: ['', Validators.required],
    movie: ['', Validators.required],
    date: [new Date(), Validators.required],
    time: ['', Validators.required],
  });

  constructor(
    private sharedService: SharedService,
    private reservationsService: ReservationsService,
    private pdfConversionService: PdfConversionService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sharedService.activateSpinner();
    this.sharedService.disableSpinner();

    this.reservationForm.valueChanges.subscribe((reservation) => {
      if (!reservation.date || !reservation.time) return;
      this.dateTime = new Date(
        moment(reservation.date).year(),
        moment(reservation.date).month(),
        moment(reservation.date).date(),
        moment(reservation.time, 'HH:mm').hours(),
        moment(reservation.time, 'HH:mm').minutes()
      );
    });
  }

  onDateSetted(type: string, event: MatDatepickerInputEvent<Date>) {
    this.date = event.value;
  }

  onHourSetted(time: string) {
    this.time = time;
  }

  async csvInputChange(fileInputEvent: any) {
    this.sharedService.activateSpinner();

    const file: File = fileInputEvent.target.files[0];

    this.selectedFile = file;
    this.hasFile = true;

    if (file) {
      try {
        this.ticketText = await this.pdfConversionService.convertToText(file);
        this.selectedFileContent =
          await this.pdfConversionService.convertToImage(file);

        this.getSetTicketLocation();
        this.getSetTicketMovie();
        this.getSetTicketDateTime();

        this.sharedService.disableSpinner();
      } catch (error) {
        console.error('Error converting PDF:', error);
        this.ticketText = '';
        this.sharedService.disableSpinner();
      }
    }
  }

  onSave(): void {
    if (this.reservationForm.invalid) return;

    this.sharedService.activateSpinner();

    try {
      const formValues = this.reservationForm.value;

      const newReservation: Reservation = {
        movieTitle: formValues.movie || '',
        location: formValues.location || '',
        dateTime: Timestamp.fromDate(this.dateTime || new Date()),
        fileContent: this.selectedFileContent,
        uid: this.sharedService.getUserId(),
        localStorageId: Guid.create().toString(),
      };

      this.reservationsService
        .createReservationInFirestore(newReservation)
        .then((id) => {
          if (id) {
            newReservation.fileContent = this.selectedFileContent;
            newReservation.id = id;
            this.reservationsService.saveReservationToLocalStorage(
              newReservation
            );
          }
          this.reservationsService.readReservations();
          this.router.navigateByUrl('/home').then(() => {
            this.sharedService.disableSpinner();
          });
        });
    } catch (error) {
      console.error('SAVE ERROR', error);
      this.sharedService.disableSpinner();
    }
  }

  getSetTicketLocation(): void {
    const isLido =
      this.ticketText.toLocaleLowerCase().indexOf('lido di venezia') != -1;

    var location = '';

    if (isLido) {
      const indexOfLido = this.ticketText.indexOf('- Lido di Venezia');
      location = this.ticketText
        .substring(indexOfLido - 20, indexOfLido)
        .replace(/\d+/g, '')
        .trim();
    } else {
      location = 'VENICE IMMERSIVE';
    }

    this.reservationForm.patchValue({
      location,
    });
  }

  getSetTicketMovie(): void {
    const isLido =
      this.ticketText.toLocaleLowerCase().indexOf('lido di venezia') != -1;
    var startIndex;

    if (isLido)
      startIndex =
        this.ticketText.toLocaleLowerCase().indexOf('lido di venezia') + 15;
    else
      startIndex = this.ticketText.toLocaleLowerCase().indexOf('- venezia') + 9;

    const ticketCleaned = this.ticketText
      .substring(startIndex, this.ticketText.length - 1)
      .trimStart();
    const reservationDate = this.sharedService
      .getDateTimeFromString(this.ticketText)
      .split(' ')[0]
      .trim();

    const movieTitle = ticketCleaned
      .substring(0, ticketCleaned.indexOf(reservationDate))
      .trimEnd();

    this.reservationForm.patchValue({
      movie: movieTitle,
    });
  }

  getSetTicketDateTime(): void {
    const ticketDateTime = this.sharedService.getDateTimeFromString(
      this.ticketText
    );

    if (ticketDateTime == '') return;

    const ticketDate: string = ticketDateTime.split(' ')[0].trim();
    const ticketTime: string = ticketDateTime.split(' ')[1].trim();

    const hours = ticketTime.split(':')[0];
    const minutes = ticketTime.split(':')[1];
    const dateTime = moment(ticketDate, 'DD-MM-YYYY')
      .add(hours, 'hours')
      .add(minutes, 'minutes');

    this.formatDate = moment(ticketDate, 'DD-MM-YYYY').format('DD/MM/YYYY');
    this.time = ticketTime;
    this.formatDateTime = moment(dateTime).format('DD/MM/YYYY HH:mm');
    this.dateTime = new Date(
      moment(dateTime).year(),
      moment(dateTime).month(),
      moment(dateTime).date(),
      moment(dateTime).hours(),
      moment(dateTime).minutes()
    );

    this.reservationForm.patchValue({
      date: new Date(
        moment(dateTime).year(),
        moment(dateTime).month(),
        moment(dateTime).date()
      ),
      time: ticketTime,
    });
  }
}
