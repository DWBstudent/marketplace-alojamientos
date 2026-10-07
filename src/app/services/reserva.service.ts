import { Injectable, signal } from '@angular/core';
import { Reserva } from '../models/reserva';

const CLAVE_RESERVAS = 'marketplace-reservas';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();
  private readonly reservasSignal = signal<Reserva[]>(this.cargarDesdeStorage());
  readonly reservas = this.reservasSignal.asReadonly();

  crearReserva(datos: Omit<Reserva, 'id' | 'estado'>): Reserva {
    const nueva: Reserva = {
      ...datos,
      id: this.generarId(),
      estado: 'CONFIRMADA',
    };
    this.reservasSignal.update((lista) => [...lista, nueva]);
    this.guardarEnStorage();
    return nueva;
  }

  private generarId(): string {
    return (
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    );
  }

  private cargarDesdeStorage(): Reserva[] {
    try {
      const crudo = localStorage.getItem(CLAVE_RESERVAS);
      return crudo ? (JSON.parse(crudo) as Reserva[]) : [];
    } catch {
      this.errorSignal.set('No se pudieron leer las reservas guardadas.');
      return [];
    }
  }

  private guardarEnStorage(): void {
    try {
      localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(this.reservasSignal()));
      this.errorSignal.set(null);
    } catch {
      this.errorSignal.set('No se pudo guardar la reserva en este dispositivo.');
    }
  }
}
