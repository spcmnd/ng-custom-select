import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CustomSelectComponentModule } from './custom-select/custom-select.component.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CustomSelectComponentModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
