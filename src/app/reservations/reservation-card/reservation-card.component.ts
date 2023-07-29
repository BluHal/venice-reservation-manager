import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Reservation } from './reservation.interface';
import { ReservationsService } from '../reservations.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
  animations: [
    trigger('cardAnimator', [
      state('left', style({ transform: 'translateX(-75px)' })),
      state('original', style({ transform: 'translateX(0)' })),
      transition('original => left', [animate('0.15s ease-in-out')]),
      transition('left => original', [animate('0.15s ease-in-out')]),
    ]),
  ],
})
export class ReservationCardComponent implements OnInit {
  @Input() reservation!: Reservation;

  public currentState = 'original';
  public delBtnZIndex: string = '-1';
  public date: string = '';
  public showImg: boolean = false;

  private swipeCoord!: [number, number];
  private swipeTime!: number;


  constructor(private reservationsService: ReservationsService) {}

  ngOnInit() {
    this.date = moment(this.reservation.dateTime?.toDate()).format('DD/MM/YYYY HH:mm');
  }

  swipeCardLeft(): void {
    if (this.currentState !== 'original') return;
    this.currentState = 'left';
  }

  swipeCardRight(): void {
    if (this.currentState !== 'left') return;
    this.currentState = 'original';
  }

  onAnimationCompleted(): void {
    if (this.currentState == 'original') {
      this.delBtnZIndex = '-1';
    } else if (this.currentState == 'left') {
      this.delBtnZIndex = '1';
    }
  }

  onAnimationStarted(): void {
    this.delBtnZIndex = '-1';
  }

  deleteItem(): void {
    // this.reservationsService.deleteReservation(this.reservation.id || '');
    this.reservationsService.deleteReservationInFirestore(this.reservation.id || '');
  }

  showTicket(): void {
    this.showImg = true
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY,
    ];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [
        coord[0] - this.swipeCoord[0],
        coord[1] - this.swipeCoord[1],
      ];
      const duration = time - this.swipeTime;

      if (
        duration < 1000 && //
        Math.abs(direction[0]) > 30 && // Long enough
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        // Horizontal enough
        const swipe = direction[0] < 0 ? 'left' : 'right';

        if (swipe == 'left') {
          this.swipeCardLeft();
        } else if (swipe == 'right') {
          this.swipeCardRight();
        }
      }
    }
  }
}
