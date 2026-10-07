import { TipoAlojamiento } from './alojamiento';

export interface FiltroBusqueda {
  ciudad: string | null;
  tipo: TipoAlojamiento | null;
  huespedes: number | null;
  precioMaximo: number | null;
}
export const FILTRO_VACIO: FiltroBusqueda = {
  ciudad: null,
  tipo: null,
  huespedes: null,
  precioMaximo: null,
};
