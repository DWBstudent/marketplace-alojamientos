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

  protected readonly estancia = signal<DatosEstancia>(ESTANCIA_VACIA);

  protected cambiarLlegada(valor: string): void {
    this.estancia.update((actual) => ({ ...actual, fechaLlegada: valor }));
  }

  protected cambiarSalida(valor: string): void {
    this.estancia.update((actual) => ({ ...actual, fechaSalida: valor }));
  }

  protected escribirHuespedes(valor: string): void {
    this.estancia.update((actual) => ({
      ...actual,
      huespedes: valor === '' ? null : Number(valor),
    }));
  }

  protected cambiarHuespedes(paso: number): void {
    const actual = this.estancia().huespedes ?? 0;
    const nuevo = Math.min(Math.max(actual + paso, 1), this.capacidad());
    this.estancia.update((estancia) => ({ ...estancia, huespedes: nuevo }));
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    this.cotizar.emit(this.estancia());
  }
}
