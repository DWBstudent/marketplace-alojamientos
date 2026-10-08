import { Injectable } from '@angular/core';

export interface DatosCotizacion {
  fechaLlegada: string;
  fechaSalida: string;
  huespedes: number | null;
}

@Injectable({ providedIn: 'root' })
export class ValidacionCotizacionService {
  validar(datos: DatosCotizacion, capacidad: number): string[] {
    return [...this.validarFechas(datos), ...this.validarHuespedes(datos.huespedes, capacidad)];
  }

  private validarFechas(datos: DatosCotizacion): string[] {
    if (!datos.fechaLlegada || !datos.fechaSalida) {
      return ['Selecciona las fechas de llegada y salida.'];
    }

    const errores: string[] = [];

    if (datos.fechaLlegada < this.fechaDeHoy()) {
      errores.push('La fecha de llegada no puede ser anterior a hoy.');
    }
    if (datos.fechaSalida <= datos.fechaLlegada) {
      errores.push('La fecha de salida debe ser posterior a la de llegada.');
    }

    return errores;
  }

  private validarHuespedes(huespedes: number | null, capacidad: number): string[] {
    if (huespedes === null || !Number.isInteger(huespedes) || huespedes <= 0) {
      return ['El número de huéspedes debe ser mayor que cero.'];
    }
    if (huespedes > capacidad) {
      return [`Máximo ${capacidad} huéspedes para este alojamiento.`];
    }
    return [];
  }

  private fechaDeHoy(): string {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${ahora.getFullYear()}-${mes}-${dia}`;
  }
}
