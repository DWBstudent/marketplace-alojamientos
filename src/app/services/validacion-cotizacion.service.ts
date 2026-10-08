import { Injectable } from '@angular/core';

import { DatosEstancia, ErroresEstancia } from '../models/estancia';

@Injectable({ providedIn: 'root' })
export class ValidacionCotizacionService {
  validar(datos: DatosEstancia, capacidad: number): ErroresEstancia {
    return { ...this.validarFechas(datos), ...this.validarHuespedes(datos.huespedes, capacidad) };
  }

  private validarFechas(datos: DatosEstancia): ErroresEstancia {
    const errores: ErroresEstancia = {};

    if (!datos.fechaLlegada) {
      errores.fechaLlegada = 'Selecciona la fecha de llegada.';
    } else if (datos.fechaLlegada < this.fechaDeHoy()) {
      errores.fechaLlegada = 'La fecha de llegada no puede ser anterior a hoy.';
    }

    if (!datos.fechaSalida) {
      errores.fechaSalida = 'Selecciona la fecha de salida.';
    } else if (datos.fechaLlegada && datos.fechaSalida <= datos.fechaLlegada) {
      errores.fechaSalida = 'La fecha de salida debe ser posterior a la de llegada.';
    }

    return errores;
  }

  private validarHuespedes(huespedes: number | null, capacidad: number): ErroresEstancia {
    if (huespedes === null || !Number.isInteger(huespedes) || huespedes <= 0) {
      return { huespedes: 'El número de huéspedes debe ser mayor que cero.' };
    }
    if (huespedes > capacidad) {
      const unidad = capacidad === 1 ? 'huésped' : 'huéspedes';
      return { huespedes: `Máximo ${capacidad} ${unidad} para este alojamiento.` };
    }
    return {};
  }

  private fechaDeHoy(): string {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${ahora.getFullYear()}-${mes}-${dia}`;
  }
}
