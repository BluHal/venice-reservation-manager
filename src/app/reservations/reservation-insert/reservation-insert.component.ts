import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import * as moment from 'moment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { PdfConversionService } from 'src/app/shared/pdf-conversion.service';

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
  private time?: string;
  private dateTime?: string;

  private selectedFile: any;
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
    private pdfConversionService: PdfConversionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sharedService.activateSpinner();
    this.sharedService.disableSpinner();
  }

  onDateSetted(type: string, event: MatDatepickerInputEvent<Date>) {
    this.date = event.value;
  }

  onHourSetted(time: string) {
    this.time = time;
  }

  addReservation(): void {
    const hours = this.time?.split(':')[0];
    const minutes = this.time?.split(':')[1];
    this.dateTime = moment(this.date)
      .add(hours, 'hours')
      .add(minutes, 'minutes')
      .format('DD/MM/YYYY hh:mm');

    console.log(this.selectedFile);
    console.log(this.dateTime);
  }

  async csvInputChange(fileInputEvent: any) {
    this.selectedFile = fileInputEvent.target.files[0];
    this.hasFile = true;

    const file: File = fileInputEvent.target.files[0];
    if (file) {
      try {
        this.ticketText = await this.pdfConversionService.convertToText(file);
        this.getSetTicketLocation();
        this.getSetTicketMovie();
        this.getSetTicketDateTime();
      } catch (error) {
        console.error('Error converting PDF:', error);
        this.ticketText = '';
      }
    }
  }

  onSave(): void {
    console.log(
      'submitted form',
      this.reservationForm.value,
      this.reservationForm.invalid
    );
  }

  getSetTicketLocation(): void {
    const location = this.ticketText
      .substring(0, this.ticketText.indexOf('-'))
      .trimEnd()
      .trimStart();
    console.log(location);

    this.reservationForm.patchValue({
      location,
    });
  }

  getSetTicketMovie(): void {
    const ticketCleaned = this.ticketText
      .substring(
        this.ticketText.indexOf('Venezia') + 7,
        this.ticketText.length - 1
      )
      .trimStart();
    const reservationDate = this.sharedService
      .getDateTimeFromString(this.ticketText)
      .split(' ')[0]
      .trim();

    const movieTitle = ticketCleaned
      .substring(0, ticketCleaned.indexOf(reservationDate))
      .trimEnd();
    console.log(movieTitle);

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
    console.log(
      new Date(ticketDate).getFullYear(),
      new Date(ticketDate).getDate(),
      new Date(ticketDate).getMonth() + 1
    );

    this.reservationForm.patchValue({
      date: new Date(
        new Date(ticketDate).getFullYear(),
        new Date(ticketDate).getDate() - 1,
        new Date(ticketDate).getMonth() + 1
      ),
      time: ticketTime,
    });
  }
}
