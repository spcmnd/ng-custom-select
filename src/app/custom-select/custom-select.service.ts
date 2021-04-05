import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class CustomSelectService {
  private selectedOptionValue$ = new BehaviorSubject(undefined);
  private optionSelectedEvent$ = new Subject<void>();

  public listenOptionSelectedEvent(): Observable<void> {
    return this.optionSelectedEvent$.asObservable();
  }

  public getSelectedValue(): Observable<any> {
    return this.selectedOptionValue$.asObservable();
  }

  public setSelectedValue(value: any): void {
    this.selectedOptionValue$.next(value);
    this.optionSelectedEvent$.next();
  }
}
