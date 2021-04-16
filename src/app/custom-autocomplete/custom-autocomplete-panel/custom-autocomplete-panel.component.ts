import { Component, TemplateRef } from '@angular/core';

@Component({
  templateUrl: 'custom-autocomplete-panel.component.html',
  styleUrls: ['custom-autocomplete-panel.component.scss'],
})
export class CustomAutocompletePanelComponent {
  /*
   * Template ref set by CustomAutocompleteComponent when rendering overlay
   */
  public optionsTemplateRef: TemplateRef<any>;
}
