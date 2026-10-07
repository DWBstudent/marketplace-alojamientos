import { Injectable, signal } from '@angular/core';
import { Reserva } from '../models/reserva';

const CLAVE_RESERVAS = 'marketplace-reservas';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly _reservas = signal<Reserva[]>(this.cargarDesdeStorage());
  readonly reservas = this._reservas.asReadonly();

  crearReserva(datos: Omit<Reserva, 'id' | 'estado'>): Reserva {
    const nueva: Reserva = {
      ...datos,
      id: crypto.randomUUID(),
      estado: 'CONFIRMADA'
    };
    this._reservas.update(lista => [...lista, nueva]);
    this.guardarEnStorage();
    return nueva;
  }
  private cargarDesdeStorage(): Reserva[] {
    try {
      const crudo = localStorage.getItem(CLAVE_RESERVAS);
      return crudo ? (JSON.parse(crudo) as Reserva[]) : [];
    } catch {
      return [];
    }
  }

  private guardarEnStorage(): void {
    try {
      localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(this._reservas()));
    } catch {
      console.error('No se pudo guardar las reservas');
    }
  }
}
