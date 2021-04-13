import { InjectionToken } from '@angular/core';
import { CustomSelectComponent } from './custom-select.component';

export interface ICustomSelectOptionParent {
  setSelectedValue: (value: any) => void;
}

export const CUSTOM_SELECT_OPTION_PARENT = new InjectionToken<CustomSelectComponent>(
  'CUSTOM_SELECT_OPTION_PARENT'
);
