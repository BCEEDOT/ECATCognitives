import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[myHighlight]'
})
export class MyHighlightDirective {

  constructor(private el: ElementRef) { }

  @Input() set myHighlight(condition: boolean) {
    if (condition) {
      this.el.nativeElement.style.backgroundColor = "#73a0c3"
      this.el.nativeElement.style.color = "#ffffff"

    } else {
      this.el.nativeElement.style.backgroundColor = ""
      this.el.nativeElement.style.color = ""
    }


  }

}
