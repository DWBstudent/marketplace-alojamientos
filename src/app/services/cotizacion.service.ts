import { Injectable } from '@angular/core';

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const FORMATO_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;

@Injectable({ providedIn: 'root' })
export class CotizacionService {
  // Days between arrival and departure. The "YYYY-MM-DD" dates are read as UTC
  // midnights, so the local time zone and daylight saving time never change the count.
  // Gives 0 when a date is empty, malformed or not a real date.
  calcularNoches(fechaLlegada: string, fechaSalida: string): number {
    const llegada = this.aDiaUtc(fechaLlegada);
    const salida = this.aDiaUtc(fechaSalida);

    return llegada === null || salida === null ? 0 : Math.round((salida - llegada) / MS_POR_DIA);
  }

  private aDiaUtc(fecha: string): number | null {
    const partes = FORMATO_FECHA.exec(fecha);

    if (partes === null) {
      return null;
    }

    const [anio, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])];
    const instante = new Date(Date.UTC(anio, mes - 1, dia));

    // Date.UTC rolls over impossible dates (2026-02-31 -> March): reject them.
    const esReal =
      instante.getUTCFullYear() === anio &&
      instante.getUTCMonth() === mes - 1 &&
      instante.getUTCDate() === dia;

    return esReal ? instante.getTime() : null;
  }
}
