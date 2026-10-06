import { TipoAlojamiento } from './alojamiento';

export interface FiltroBusqueda {
  ciudad: string | null;
  tipo: TipoAlojamiento | null;
  huespedes: number | null;
  precioMaximo: number | null;
}
