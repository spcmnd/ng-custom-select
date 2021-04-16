import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CustomAutocompleteComponentModule } from './custom-autocomplete/custom-autocomplete.component.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CustomAutocompleteComponentModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
