import { Reserva } from './reserva';

export type DatosHuesped = Pick<Reserva, 'nombreHuesped' | 'correoHuesped'>;
