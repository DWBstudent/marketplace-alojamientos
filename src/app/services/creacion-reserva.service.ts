import { Injectable } from '@angular/core';

import { Alojamiento } from '../models/alojamiento';
import { Cotizacion } from '../models/cotizacion';
import { DatosEstancia } from '../models/estancia';
import { DatosHuesped } from '../models/huesped';
import { Reserva } from '../models/reserva';

// What a reservation carries before ReservaService gives it an id and the CONFIRMADA state.
export type DatosNuevaReserva = Omit<Reserva, 'id' | 'estado'>;

@Injectable({ providedIn: 'root' })
export class CreacionReservaService {
  // Gathers the minimum fields of section 3.5: basic lodging information, dates, guests,
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
}
