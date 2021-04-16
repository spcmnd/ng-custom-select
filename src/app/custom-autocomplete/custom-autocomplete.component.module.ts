import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomAutocompleteOptionComponent } from './custom-autocomplete-option/custom-autocomplete-option.component';
import { CustomAutocompletePanelComponent } from './custom-autocomplete-panel/custom-autocomplete-panel.component';
import { CustomAutocompleteComponent } from './custom-autocomplete.component';

@NgModule({
  declarations: [
    CustomAutocompleteComponent,
    CustomAutocompletePanelComponent,
    CustomAutocompleteOptionComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, OverlayModule, PortalModule],
  exports: [CustomAutocompleteComponent, CustomAutocompleteOptionComponent],
})
export class CustomAutocompleteComponentModule {}
