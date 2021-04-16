import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
} from '@angular/core';
import {
  CUSTOM_AUTOCOMPLETE_OPTION_PARENT,
  ICustomAutocompleteOptionParent,
} from '../custom-autocomplete-parent';

@Component({
  selector: 'app-custom-autocomplete-option',
  templateUrl: 'custom-autocomplete-option.component.html',
  styleUrls: ['custom-autocomplete-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAutocompleteOptionComponent {
  /*
   * Value of the option to be stored in parent internalControl
   */
  @Input() public value: any;

  constructor(
    @Inject(CUSTOM_AUTOCOMPLETE_OPTION_PARENT)
    private customAutocompleteComponent: ICustomAutocompleteOptionParent
  ) {}

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.customAutocompleteComponent.setSelectedValue(this.value);
  }
}
