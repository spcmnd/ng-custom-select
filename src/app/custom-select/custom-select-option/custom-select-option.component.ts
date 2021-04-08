import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
} from '@angular/core';
import { CUSTOM_SELECT_OPTION_PARENT } from '../custom-select-parent';
import { CustomSelectComponent } from '../custom-select.component';

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
    private customSelectComponent: CustomSelectComponent
  ) {
    if (
      !(
        customSelectComponent ||
        customSelectComponent instanceof CustomSelectComponent
      )
    ) {
      throw Error(
        'CustomSelectOptionComponent should be encapsulated in CustomSelectComponent.'
      );
    }
  }

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.customSelectComponent.setSelectedValue(this.value);
  }
}
