import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventCtrlS]',
})
export class PreventCtrlSDirective {
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
      event.preventDefault();
    }
  }
}
