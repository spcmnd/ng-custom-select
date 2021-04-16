import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomAutocompleteOptionComponent } from './custom-autocomplete-option/custom-autocomplete-option.component';
import { CustomAutocompletePanelComponent } from './custom-autocomplete-panel/custom-autocomplete-panel.component';
import {
  CUSTOM_AUTOCOMPLETE_OPTION_PARENT,
  ICustomAutocompleteOptionParent,
} from './custom-autocomplete-parent';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: 'custom-autocomplete.component.html',
  styleUrls: ['custom-autocomplete.component.scss'],
  providers: [
    /*
     * Provide here the parent of each CustomAutocompleteOptionComponent
     * in order to catch selected option value
     */
    {
      provide: CUSTOM_AUTOCOMPLETE_OPTION_PARENT,
      useExisting: CustomAutocompleteComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAutocompleteComponent
  implements
    ControlValueAccessor,
    AfterContentInit,
    OnDestroy,
    ICustomAutocompleteOptionParent {
  /*
   * Container with CustomAutocompleteOptionComponents to render in CustomAutocompletePanelComponent
   */
  @ViewChild('optionsContainerTpl', { read: TemplateRef })
  public optionsContainerTplRef: TemplateRef<any>;

  /*
   * Query list of options rendered
   */
  @ContentChildren(CustomAutocompleteOptionComponent, {
    emitDistinctChangesOnly: true,
  })
  public customAutocompleteOptions: QueryList<CustomAutocompleteOptionComponent>;

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
   * Overlay reference used to do actions on CustomAutocompletePanelComponent
   */
  private overlayRef: OverlayRef;

  public overlayAttached: boolean;

  /*
   * Subject used to trigger takeUntil operator to avoid memory leaks
   */
  private readonly destroyed$ = new Subject<void>();

  constructor(
    @Optional() private ngControl: NgControl,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.attachOverlay();
  }

  public ngAfterContentInit(): void {
    /*
     * Listen to ContentChildren changes in order to
     * update position of the overlay in case of interface
     * unexpected changes
     */
    this.customAutocompleteOptions.changes
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => this.overlayAttached && this.overlayRef.updatePosition(),
      });
  }

  /*
   * Handle external form group set or patch value on this form control
   */
  public writeValue(value: any): void {
    this.internalControl.patchValue(
      this.displayFn ? this.setDisplayValue(value) : value
    );
  }

  /*
   * Handle value change to notify external form group
   */
  public registerOnChange(fn: any): void {
    this.internalControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (value) => {
          if (!this.overlayAttached) {
            this.attachOverlay();
          }

          if (this.displayFn) {
            this.setDisplayValue(value);
          }

          fn(value);
        },
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
      this.detachOverlay();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public handleFocus(): void {
    if (!this.overlayAttached) {
      this.attachOverlay();
    }
  }

  /*
   * Function used together with displayFn input to display user-friendly value
   */
  private setDisplayValue(value: any): string {
    const inputValue = this.displayFn(value) ? this.displayFn(value) : value;

    if (this.inputRef) {
      this.inputRef.nativeElement.value = inputValue;
    }

    return inputValue;
  }

  private attachOverlay(): void {
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
    overlayConfig.backdropClass = 'ng-custom-autocomplete-backdrop';
    overlayConfig.disposeOnNavigation = true;
    overlayConfig.width = this.elementRef.nativeElement.clientWidth;
    /*
     * Create OverlayRef in order to plug listeners and render
     * CustomAutocompletePanelComponent
     */
    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => this.detachOverlay(),
      });
    const componentRef = this.overlayRef.attach(
      new ComponentPortal(
        CustomAutocompletePanelComponent,
        this.viewContainerRef,
        this.injector
      )
    );
    this.overlayAttached = true;
    componentRef.instance.optionsTemplateRef = this.optionsContainerTplRef;
  }

  private detachOverlay(): void {
    this.overlayRef.dispose();
    this.overlayAttached = false;
    this.overlayRef = undefined;
    this.cdr.detectChanges();
  }
}
