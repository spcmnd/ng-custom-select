import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface ITestData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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

  public ngOnInit(): void {
    this.formControl = new FormControl();
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
}
