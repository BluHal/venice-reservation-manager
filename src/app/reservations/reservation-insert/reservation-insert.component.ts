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
import { ReactiveFormsModule } from '@angular/forms';
import { createWorker } from 'tesseract.js';
import { SharedService } from 'src/app/shared/shared.service';

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
  worker!: Tesseract.Worker;
  workerReady = false;

  private date?: Date | null;
  private time?: string;
  private dateTime?: string;

  private selectedFile: any;
  public hasFile = false;
  private ocrResult = '';
  private captureProgress = 0;

  constructor(private sharedService: SharedService) {
    this.loadWorker();
  }

  ngOnInit(): void {
    this.sharedService.activateSpinner();
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

  csvInputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
    this.selectedFile = fileInputEvent.target.files[0];
    this.hasFile = true;
  }

  async loadWorker() {
    this.worker = await createWorker({
      logger: (progress) => {
        console.log(progress);
        if (progress.status == 'recognizing test') {
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      },
    });

    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    this.workerReady = true;
    this.sharedService.disableSpinner();
  }

  async recognizeFile() {
    //const result = await this.worker.recognize(this.worker.getPDF())
  }
}
