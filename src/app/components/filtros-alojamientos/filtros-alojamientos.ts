import { Component, inject, input, model } from '@angular/core';

import { TipoAlojamiento } from '../../models/alojamiento';
import { FiltroBusqueda } from '../../models/filtro-busqueda';
import { FiltroAlojamientosService } from '../../services/filtro-alojamientos.service';

@Component({
  selector: 'app-filtros-alojamientos',
  templateUrl: './filtros-alojamientos.html',
  styleUrl: './filtros-alojamientos.css',
})
export class FiltrosAlojamientos {
  private readonly filtroService = inject(FiltroAlojamientosService);

  readonly ciudades = input.required<string[]>();
  readonly tipos = input.required<TipoAlojamiento[]>();
  readonly filtro = model.required<FiltroBusqueda>();

  protected cambiarCiudad(valor: string): void {
    this.filtro.update((actual) => ({ ...actual, ciudad: valor === '' ? null : valor }));
  }

  protected cambiarTipo(valor: string): void {
    this.filtro.update((actual) => ({
      ...actual,
      tipo: valor === '' ? null : (valor as TipoAlojamiento),
    }));
  }

  protected limpiarFiltros(): void {
    this.filtro.set(this.filtroService.limpiar());
  }
}
