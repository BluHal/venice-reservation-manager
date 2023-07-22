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
}
