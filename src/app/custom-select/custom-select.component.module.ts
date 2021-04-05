import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomSelectOptionComponent } from './custom-select-option/custom-select-option.component';
import { CustomSelectPanelComponent } from './custom-select-panel/custom-select-panel.component';
import { CustomSelectComponent } from './custom-select.component';

@NgModule({
  declarations: [
    CustomSelectComponent,
    CustomSelectPanelComponent,
    CustomSelectOptionComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, OverlayModule, PortalModule],
  exports: [CustomSelectComponent, CustomSelectOptionComponent],
})
export class CustomSelectComponentModule {}
