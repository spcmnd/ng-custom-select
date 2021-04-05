import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public formControl: FormControl;
  public testData = [
    {
      id: 1,
      name: 'First'
    },
    {
      id: 2,
      name: 'Second'
    },
    {
      id: 3,
      name: 'Third'
    },
  ];

  public ngOnInit(): void {
    this.formControl = new FormControl();
  }
}
