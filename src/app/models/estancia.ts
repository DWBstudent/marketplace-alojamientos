export interface DatosEstancia {
  fechaLlegada: string;
  fechaSalida: string;
  huespedes: number | null;
}

export type ErroresEstancia = Partial<Record<keyof DatosEstancia, string>>;

export const ESTANCIA_VACIA: DatosEstancia = {
  fechaLlegada: '',
  fechaSalida: '',
  huespedes: null,
};
