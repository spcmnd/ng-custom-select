import {
  Component,

  HostListener,
  Input
} from '@angular/core';
import { CustomSelectService } from '../custom-select.service';

@Component({
  selector: 'app-custom-select-option',
  templateUrl: 'custom-select-option.component.html',
  styleUrls: ['custom-select-option.component.scss'],
})
export class CustomSelectOptionComponent {
  @Input() public value: any;

  constructor(private customSelectService: CustomSelectService) {}

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.customSelectService.setSelectedValue(this.value);
  }
}
