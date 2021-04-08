import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomSelectPanelComponent } from './custom-select-panel/custom-select-panel.component';
import { CUSTOM_SELECT_OPTION_PARENT } from './custom-select-parent';

@Component({
  selector: 'app-custom-select',
  templateUrl: 'custom-select.component.html',
  styleUrls: ['custom-select.component.scss'],
  providers: [
    {
      provide: CUSTOM_SELECT_OPTION_PARENT,
      useExisting: CustomSelectComponent,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor, OnDestroy {
  /*
   * Container with CustomSelectOptionComponents to render in CustomSelectPanelComponent
   */
  @ViewChild('optionsContainerTpl', { read: TemplateRef })
  public optionsContainerTplRef: TemplateRef<any[]>;

  /*
   * Native HTML input reference used to set display value
   */
  @ViewChild('input') public inputRef: ElementRef<HTMLInputElement>;

  @Input() public placeholder: string;

  /*
   * Display function used to handle complex objects and display user-friendly value
   */
  @Input() public displayFn: (value: any) => string;

  /*
  * Notify parent component when option is selected
  */
  @Output() public selectedOptionEvent = new EventEmitter();

  /*
   * FormControl used to be linked to native HTML input
   */
  public internalControl = new FormControl();

  /*
   * Overlay reference used to do actions on CustomSelectPanelComponent
   */
  private overlayRef: OverlayRef;

  /*
   * Subject used to trigger takeUntil operator to avoid memory leaks
   */
  private readonly destroyed$ = new Subject<void>();

  constructor(
    @Optional() private ngControl: NgControl,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();
    /*
     * Create OverlayConfig instance to set OverlayRef position and behavior.
     */
    const overlayConfig = new OverlayConfig();
    overlayConfig.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
    overlayConfig.hasBackdrop = true;
    overlayConfig.disposeOnNavigation = true;
    overlayConfig.width = this.elementRef.nativeElement.clientWidth;
    /*
     * Create OverlayRef in order to plug listeners and render
     * CustomSelectPanelComponent
     */
    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => this.overlayRef.dispose(),
      });
    const componentRef = this.overlayRef.attach(
      new ComponentPortal(
        CustomSelectPanelComponent,
        this.viewContainerRef,
        this.injector
      )
    );
    componentRef.instance.optionsTemplateRef = this.optionsContainerTplRef;
  }

  /*
   * Handle external form group set or patch value on this form control
   */
  public writeValue(value: any): void {
    this.internalControl.patchValue(
      this.displayFn ? this._setDisplayValue(value) : value
    );
  }

  /*
   * Handle value change to notify external form group
   */
  public registerOnChange(fn: any): void {
    this.internalControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (value) =>
          fn(this.displayFn ? this._setDisplayValue(value) : value),
      });
  }

  /*
   * Notify external form group about input touched state
   */
  public registerOnTouched(fn: () => void): void {
    fn = this.onTouched;
  }

  /*
   * Handle disable/enable methods on form control
   */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }

  /*
   * Function called from blur event on native HTML input
   */
  public onTouched(): void {}

  /*
   * Function called when an option is selected
   */
  public setSelectedValue(value: any): void {
    if (value) {
      this.internalControl.patchValue(value);
      this.selectedOptionEvent.emit(value);
      this.overlayRef.dispose();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /*
   * Function used together with displayFn input to display user-friendly value
   */
  private _setDisplayValue(value: any): string {
    const inputValue = this.displayFn(value) ? this.displayFn(value) : '';

    if (this.inputRef) {
      this.inputRef.nativeElement.value = inputValue;
    }

    return inputValue;
  }
}
