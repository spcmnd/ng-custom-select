import { Component, TemplateRef } from '@angular/core';

@Component({
  templateUrl: 'custom-select-panel.component.html',
  styleUrls: ['custom-select-panel.component.scss'],
})
export class CustomSelectPanelComponent {
  public optionsTemplateRef: TemplateRef<any>;
}
