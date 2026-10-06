export type EstadoReserva = 'CONFIRMADA';

export interface Reserva {
  id: string;
  alojamientoId: number;
  alojamientoNombre: string;
  ciudad: string;
  fechaLlegada: string;
  fechaSalida: string;
  huespedes: number;
  noches: number;
  valorTotal: number;
  nombreHuesped: string;
  correoHuesped: string;
  estado: EstadoReserva;
}
