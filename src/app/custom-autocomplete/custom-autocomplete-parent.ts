import { InjectionToken } from '@angular/core';
import { CustomAutocompleteComponent } from './custom-autocomplete.component';

export interface ICustomAutocompleteOptionParent {
  setSelectedValue: (value: any) => void;
}

export const CUSTOM_AUTOCOMPLETE_OPTION_PARENT = new InjectionToken<CustomAutocompleteComponent>(
  'CUSTOM_AUTOCOMPLETE_OPTION_PARENT'
);
