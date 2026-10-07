import { Component, computed, input, output, signal } from '@angular/core';

import { DatosHuesped } from '../../models/huesped';

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-formulario-huesped',
  templateUrl: './formulario-huesped.html',
  styleUrl: './formulario-huesped.css',
})
export class FormularioHuesped {
  readonly habilitado = input.required<boolean>();
  readonly reservar = output<DatosHuesped>();

  protected readonly nombre = signal('');
  protected readonly correo = signal('');
  protected readonly intentado = signal(false);

  protected readonly errorNombre = computed(() =>
    this.nombre().trim() === '' ? 'El nombre del huésped es obligatorio.' : null,
  );

  protected readonly errorCorreo = computed(() => {
    const correo = this.correo().trim();
    if (correo === '') {
      return 'El correo electrónico es obligatorio.';
    }
    return FORMATO_CORREO.test(correo) ? null : 'Escribe un correo electrónico válido.';
  });

  protected enviar(evento: Event): void {
    evento.preventDefault();
    this.intentado.set(true);

    if (!this.habilitado() || this.errorNombre() || this.errorCorreo()) {
      return;
    }

    this.reservar.emit({
      nombreHuesped: this.nombre().trim(),
      correoHuesped: this.correo().trim(),
    });
  }
}
