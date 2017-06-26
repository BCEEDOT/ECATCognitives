import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[myHighlight]'
})
export class MyhighlightDirective {

  @Input('myHighlight') cellNumber: number;

  constructor(el: ElementRef) {
    console.log(el);
    console.log(el.nativeElement.cellIndex);
   }

   @HostListener('mouseenter') onMouseEnter() {
    this.highlight('color');
   }

   @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
 
  highlight(color: string) {
    console.log(this.cellNumber);
    
  }

}
