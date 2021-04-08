import { Component, TemplateRef } from '@angular/core';

@Component({
  templateUrl: 'custom-select-panel.component.html',
  styleUrls: ['custom-select-panel.component.scss'],
})
export class CustomSelectPanelComponent {
  /*
   * Template ref set by CustomSelectComponent when rendering overlay
   */
  public optionsTemplateRef: TemplateRef<any>;
}
