import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
} from '@angular/core';
import {
  CUSTOM_SELECT_OPTION_PARENT,
  ICustomSelectOptionParent,
} from '../custom-select-parent';

@Component({
  selector: 'app-custom-select-option',
  templateUrl: 'custom-select-option.component.html',
  styleUrls: ['custom-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectOptionComponent {
  /*
   * Value of the option to be stored in parent internalControl
   */
  @Input() public value: any;

  constructor(
    @Inject(CUSTOM_SELECT_OPTION_PARENT)
    private customSelectComponent: ICustomSelectOptionParent
  ) {}

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.customSelectComponent.setSelectedValue(this.value);
  }
}
