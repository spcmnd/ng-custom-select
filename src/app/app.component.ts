import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';

interface ITestData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public formControl: FormControl;
  public testData: ITestData[] = [
    {
      id: 1,
      name: 'First',
    },
    {
      id: 2,
      name: 'Second',
    },
    {
      id: 3,
      name: 'Third',
    },
  ];
  public filteredOptions$: Observable<ITestData[]>;

  private readonly destroyed$ = new Subject();

  public ngOnInit(): void {
    this.formControl = new FormControl();
    this.filteredOptions$ = this.formControl.valueChanges.pipe(
      takeUntil(this.destroyed$),
      startWith(''),
      tap({
        next: (v) => console.log('FormControl value:', v)
      }),
      map((value: string | ITestData) => (typeof value === 'string' ? value : value.name)),
      map((value) =>
        this.testData.filter((td) =>
          td.name.trim().toLowerCase().includes(value.trim().toLowerCase())
        )
      ),
    );
  }

  public displayFn(value: ITestData): string {
    if (!value) {
      return;
    }

    return value.name;
  }

  public handleSelectedOption(value: ITestData): void {
    console.log('Custom select option selected:', value);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
