import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true, // Hacemos que la directiva sea standalone
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = ''; // El texto que pasaremos a la directiva
  tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // Método para crear el tooltip
  createTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltipElement,
      this.renderer.createText(this.tooltipText)
    );

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background-color', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');

    // Obtener la posición del botón relativo a la ventana
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // Calcular la posición del tooltip
    if (this.tooltipElement) {
      const tooltipPosTop = hostPos.top - this.tooltipElement.offsetHeight - 27; // Arriba del botón
      const tooltipPosLeft = hostPos.left - 33;

      // Establecer la posición usando las coordenadas globales
      this.renderer.setStyle(this.tooltipElement, 'top', `${tooltipPosTop}px`);
      this.renderer.setStyle(
        this.tooltipElement,
        'left',
        `${tooltipPosLeft}px`
      );

      // Adjuntar el tooltip al body para evitar problemas con position relative
      this.renderer.appendChild(document.body, this.tooltipElement);
    }
  }

  // Método para eliminar el tooltip
  destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  // Escucha cuando el mouse entra en el elemento
  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipElement) {
      this.createTooltip();
    }
  }

  // Escucha cuando el mouse sale del elemento
  @HostListener('mouseleave') onMouseLeave() {
    this.destroyTooltip();
  }

  @HostListener('click') onClick() {
    this.destroyTooltip();
  }
}
