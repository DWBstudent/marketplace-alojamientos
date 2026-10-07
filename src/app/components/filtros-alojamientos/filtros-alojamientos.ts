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

  protected cambiarHuespedes(valor: string): void {
    const huespedes = this.aNumeroPositivo(valor);

    this.filtro.update((actual) => ({
      ...actual,
      huespedes: huespedes !== null && Number.isInteger(huespedes) ? huespedes : null,
    }));
  }

  protected cambiarPrecioMaximo(valor: string): void {
    this.filtro.update((actual) => ({ ...actual, precioMaximo: this.aNumeroPositivo(valor) }));
  }

  protected limpiarFiltros(): void {
    this.filtro.set(this.filtroService.limpiar());
  }

  private aNumeroPositivo(valor: string): number | null {
    const numero = Number(valor);

    return valor.trim() !== '' && Number.isFinite(numero) && numero > 0 ? numero : null;
  }
}


