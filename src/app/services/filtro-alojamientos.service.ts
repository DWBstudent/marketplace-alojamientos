import { Injectable } from '@angular/core';

import { Alojamiento } from '../models/alojamiento';
import { FiltroBusqueda } from '../models/filtro-busqueda';

@Injectable({ providedIn: 'root' })
export class FiltroAlojamientosService {
  aplicar(alojamientos: Alojamiento[], filtro: FiltroBusqueda): Alojamiento[] {
    return alojamientos.filter(
      (alojamiento) =>
        this.cumpleCiudad(alojamiento, filtro) &&
        this.cumpleTipo(alojamiento, filtro) &&
        this.cumpleHuespedes(alojamiento, filtro) &&
        this.cumplePrecioMaximo(alojamiento, filtro),
    );
  }

  private cumpleCiudad(alojamiento: Alojamiento, filtro: FiltroBusqueda): boolean {
    return filtro.ciudad === null || alojamiento.ciudad === filtro.ciudad;
  }

  private cumpleTipo(alojamiento: Alojamiento, filtro: FiltroBusqueda): boolean {
    return filtro.tipo === null || alojamiento.tipo === filtro.tipo;
  }


  private cumpleHuespedes(alojamiento: Alojamiento, filtro: FiltroBusqueda): boolean {
    return filtro.huespedes === null || alojamiento.capacidad >= filtro.huespedes;
  }


  private cumplePrecioMaximo(alojamiento: Alojamiento, filtro: FiltroBusqueda): boolean {
    return filtro.precioMaximo === null || alojamiento.precioNoche <= filtro.precioMaximo;
  }
}
