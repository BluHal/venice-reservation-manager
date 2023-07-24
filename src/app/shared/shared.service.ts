import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public showSpinner$ = new BehaviorSubject(false);

  public activateSpinner() {
    this.showSpinner$.next(true);
  }

  public disableSpinner() {
    this.showSpinner$.next(false);
  }

  public getSpinnerStatus(): boolean {
    return this.showSpinner$.value;
  }

  public getDateTimeFromString(str: string): string {
    const pattern = /\b\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}\b/g;

    const dateTimes: string[] = str.match(pattern) || [];

    if (dateTimes.length == 0) return '';

    return dateTimes[0];
  }

  public getSubStringTilDate(str: string): string {
    const pattern = /\d{4}-\d{2}-\d{2}/;

    // Use the match method to find the first occurrence of a date in the string
    const match = str.match(pattern);

    if (match) {
      // If a date is found, extract the substring before it
      const index = str.indexOf(match[0]);
      return str.substring(0, index);
    } else {
      // If no date is found, return the original string or handle the case accordingly
      return '';
    }
  }

  public checkUserData(): boolean {
    const userData = JSON.parse(localStorage.getItem('user')!);

    if (userData) return true;

    return false;
  }
}
