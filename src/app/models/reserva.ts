export type EstadoReserva = 'CONFIRMADA';

export interface Reserva {
  id: string;
  alojamientoId: number | string;
  alojamientoNombre: string;
  ciudad: string;
  fechaLlegada: string;
  fechaSalida: string;
  huespedes: number;
  noches: number;
  total: number;
  estado: EstadoReserva;
  nombreHuesped: string;
  correoHuesped: string;
}
