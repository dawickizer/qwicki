import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[border]'
})
export class BorderDirective {
  @Input() bStyle: string = 'solid';
  @Input() bRadius: number = 0;
  @Input() bPadding: number = 0;
  @Input() bMargin: number = 0;
  @Input() bColor: string = '#673ab7';
  @Input() bWidth: number = 1;

  @HostBinding('style.borderStyle')
  get style() {
    return this.bStyle;
  }

  @HostBinding('style.borderRadius')
  get radius() {
    return `${this.bRadius}px`;
  }

  @HostBinding('style.padding')
  get padding() {
    return `${this.bPadding}px`;
  }

  @HostBinding('style.margin')
  get margin() {
    return `${this.bMargin}px`;
  }

  @HostBinding('style.borderColor')
  get color() {
    return this.bColor;
  }

  @HostBinding('style.borderWidth')
  get thickness() {
    return `${this.bWidth}px`;
  }
}