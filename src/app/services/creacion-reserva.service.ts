import { Injectable, inject } from '@angular/core';

import { Alojamiento } from '../models/alojamiento';
import { Cotizacion } from '../models/cotizacion';
import { DatosEstancia } from '../models/estancia';
import { DatosHuesped } from '../models/huesped';
import { Reserva } from '../models/reserva';
import { CotizacionService } from './cotizacion.service';
import { ReservaService } from './reserva.service';

// What a reservation carries before ReservaService gives it an id and the CONFIRMADA state.
export type DatosNuevaReserva = Omit<Reserva, 'id' | 'estado'>;

// Either the saved reservation or the reason why it could not be created.
export type ResultadoReserva = { reserva: Reserva; error: null } | { reserva: null; error: string };

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable({ providedIn: 'root' })
export class CreacionReservaService {
  private readonly cotizacionService = inject(CotizacionService);
  private readonly reservaService = inject(ReservaService);

  // Creates the reservation and saves it through ReservaService (state CONFIRMADA).
  // A reservation is only possible after a valid quote: the quote received is
  // compared with the one calculated again from the lodging and the stay.
  reservar(
    alojamiento: Alojamiento,
    estancia: DatosEstancia,
    cotizacion: Cotizacion | null,
    huesped: DatosHuesped,
  ): ResultadoReserva {
    const error = this.validar(alojamiento, estancia, cotizacion, huesped);

    if (error !== null || cotizacion === null) {
      return {
        reserva: null,
        error: error ?? 'Primero genera una cotización válida.',
      };
    }

    const datos = this.construirDatosReserva(alojamiento, estancia, cotizacion, huesped);

    return { reserva: this.reservaService.crearReserva(datos), error: null };
  }

  //Basic lodging information, dates, guests,
  // nights, total and the guest contact data. It does not validate anything.
  construirDatosReserva(
    alojamiento: Alojamiento,
    estancia: DatosEstancia,
    cotizacion: Cotizacion,
    huesped: DatosHuesped,
  ): DatosNuevaReserva {
    return {
      alojamientoId: alojamiento.id,
      alojamientoNombre: alojamiento.nombre,
      ciudad: alojamiento.ciudad,
      fechaLlegada: estancia.fechaLlegada,
      fechaSalida: estancia.fechaSalida,
      huespedes: estancia.huespedes ?? 0,
      noches: cotizacion.noches,
      total: cotizacion.total,
      nombreHuesped: huesped.nombreHuesped.trim(),
      correoHuesped: huesped.correoHuesped.trim(),
    };
  }

  private validar(
    alojamiento: Alojamiento,
    estancia: DatosEstancia,
    cotizacion: Cotizacion | null,
    huesped: DatosHuesped,
  ): string | null {
    if (!alojamiento.activo) {
      return 'Este alojamiento ya no está disponible.';
    }

    if (cotizacion === null || !this.esCotizacionValida(alojamiento, estancia, cotizacion)) {
      return 'Primero genera una cotización válida.';
    }

    const huespedes = estancia.huespedes;

    if (huespedes === null || !Number.isInteger(huespedes) || huespedes < 1) {
      return 'El número de huéspedes debe ser mayor que cero.';
    }

    if (huespedes > alojamiento.capacidad) {
      return 'El número de huéspedes supera la capacidad del alojamiento.';
    }

    if (huesped.nombreHuesped.trim() === '') {
      return 'El nombre del huésped es obligatorio.';
    }

    if (!FORMATO_CORREO.test(huesped.correoHuesped.trim())) {
      return 'Escribe un correo electrónico válido.';
    }

    return null;
  }

  // The quote is valid when it matches the one calculated now for the same lodging and stay.
  private esCotizacionValida(
    alojamiento: Alojamiento,
    estancia: DatosEstancia,
    cotizacion: Cotizacion,
  ): boolean {
    const esperada = this.cotizacionService.cotizar(alojamiento, estancia);

    return (
      esperada !== null &&
      esperada.noches === cotizacion.noches &&
      esperada.subtotal === cotizacion.subtotal &&
      esperada.tarifaLimpieza === cotizacion.tarifaLimpieza &&
      esperada.tarifaServicio === cotizacion.tarifaServicio &&
      esperada.total === cotizacion.total
    );
  }
}
