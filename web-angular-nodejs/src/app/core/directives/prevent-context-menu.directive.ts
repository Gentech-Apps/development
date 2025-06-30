import { Directive, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPreventContextMenu]',
})
export class PreventContextMenuDirective {
  unlisten!: () => void;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.unlisten = this.renderer.listen('document', 'contextmenu', (event: MouseEvent) => {
      event.preventDefault();
    });
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }
  }
}
