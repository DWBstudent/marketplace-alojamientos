import { Component, input, output, signal } from '@angular/core';

import { DatosEstancia, ESTANCIA_VACIA, ErroresEstancia } from '../../models/estancia';

@Component({
  selector: 'app-formulario-cotizacion',
  templateUrl: './formulario-cotizacion.html',
  styleUrl: './formulario-cotizacion.css',
})
export class FormularioCotizacion {
  readonly capacidad = input.required<number>();
  readonly hoy = input.required<string>();
  readonly errores = input<ErroresEstancia>({});
  readonly cotizar = output<DatosEstancia>();
  // Emitted every time the user edits a field, so the page can drop an outdated quotation.
  readonly estanciaModificada = output<void>();

  protected readonly estancia = signal<DatosEstancia>(ESTANCIA_VACIA);

  protected cambiarLlegada(valor: string): void {
    this.estancia.update((actual) => ({ ...actual, fechaLlegada: valor }));
    this.estanciaModificada.emit();
  }

  protected cambiarSalida(valor: string): void {
    this.estancia.update((actual) => ({ ...actual, fechaSalida: valor }));
    this.estanciaModificada.emit();
  }

  protected escribirHuespedes(valor: string): void {
    this.estancia.update((actual) => ({
      ...actual,
      huespedes: valor === '' ? null : Number(valor),
    }));
    this.estanciaModificada.emit();
  }

  protected cambiarHuespedes(paso: number): void {
    const actual = this.estancia().huespedes ?? 0;
    const nuevo = Math.min(Math.max(actual + paso, 1), this.capacidad());
    this.estancia.update((estancia) => ({ ...estancia, huespedes: nuevo }));
    this.estanciaModificada.emit();
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    this.cotizar.emit(this.estancia());
  }
}
