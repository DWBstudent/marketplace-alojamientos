import { Injectable, signal } from '@angular/core';
import { Reserva } from '../models/reserva';

const CLAVE_RESERVAS = 'marketplace-reservas';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  readonly error = signal<string | null>(null);
  private readonly _reservas = signal<Reserva[]>(this.cargarDesdeStorage());
  readonly reservas = this._reservas.asReadonly();

  crearReserva(datos: Omit<Reserva, 'id' | 'estado'>): Reserva {
    const nueva: Reserva = {
      ...datos,
      id: this.generarId(),
      estado: 'CONFIRMADA'
    };
    this._reservas.update(lista => [...lista, nueva]);
    this.guardarEnStorage();
    return nueva;
  }

  getReservas(): Reserva[] {
    return this._reservas();
  }

  private generarId(): string {
    return globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private cargarDesdeStorage(): Reserva[] {
    try {
      const crudo = localStorage.getItem(CLAVE_RESERVAS);
      return crudo ? (JSON.parse(crudo) as Reserva[]) : [];
    } catch {
      this.error.set('No se pudieron leer las reservas guardadas.');
      return [];
    }
  }

  private guardarEnStorage(): void {
    try {
      localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(this._reservas()));
      this.error.set(null);
    } catch {
      this.error.set('No se pudo guardar la reserva en este dispositivo.');
    }
  }
}
