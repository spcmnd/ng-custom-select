import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomSelectPanelComponent } from './custom-select-panel/custom-select-panel.component';
import { CustomSelectService } from './custom-select.service';

@Component({
  selector: 'app-custom-select',
  templateUrl: 'custom-select.component.html',
  styleUrls: ['custom-select.component.scss'],
  providers: [CustomSelectService],
})
export class CustomSelectComponent<T>
  implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChildren('optionsContainerTpl', { read: TemplateRef })
  public optionsContainerTplRef: QueryList<TemplateRef<T[]>>;
  @ViewChild('input') public inputRef: ElementRef<HTMLInputElement>;
  @Input() public placeholder: string;
  @Input() public displayFn: (value: any) => string;
  public internalControl = new FormControl();
  private overlayRef: OverlayRef;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    @Optional() private ngControl: NgControl,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private customSelectService: CustomSelectService
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @HostListener('click', ['$event'])
  public handleClick(event: MouseEvent): void {
    event.preventDefault();

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

    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => this.overlayRef.dispose(),
      });
    this.overlayRef.updateSize({
      width: this.elementRef.nativeElement.clientWidth,
    });

    const componentRef = this.overlayRef.attach(
      new ComponentPortal(
        CustomSelectPanelComponent,
        this.viewContainerRef,
        this.injector
      )
    );
    componentRef.instance.optionsTemplateRef = this.optionsContainerTplRef.first;
  }

  public ngAfterViewInit(): void {
    this.customSelectService
      .getSelectedValue()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (selectedValue) =>
          selectedValue && this.internalControl.patchValue(selectedValue),
      });
    this.customSelectService
      .listenOptionSelectedEvent()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => this.overlayRef.dispose(),
      });
  }

  public writeValue(value: T): void {
    this.internalControl.patchValue(
      this.displayFn ? this.setDisplayValue(value) : value
    );
  }

  public registerOnChange(fn: any): void {
    this.internalControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (value) =>
          fn(this.displayFn ? this.setDisplayValue(value) : value),
      });
  }

  public registerOnTouched(fn: () => void): void {
    fn = this.onTouched;
  }

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }

  public onTouched(): void {}

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private setDisplayValue(value: any): string {
    const inputValue = this.displayFn(value) ? this.displayFn(value) : '';

    if (this.inputRef) {
      this.inputRef.nativeElement.value = inputValue;
    }

    return inputValue;
  }
}
