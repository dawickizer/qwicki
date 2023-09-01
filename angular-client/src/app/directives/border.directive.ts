import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[heheBorder]',
})
export class BorderDirective {
  @Input() bStyle = 'solid';
  @Input() bRadius = 0;
  @Input() bPadding = 0;
  @Input() bMargin = 0;
  @Input() bColor = '#673ab7';
  @Input() bWidth = 1;

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
