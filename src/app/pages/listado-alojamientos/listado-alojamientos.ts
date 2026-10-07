import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AlojamientoCard } from '../../components/alojamiento-card/alojamiento-card';
import { FiltrosAlojamientos } from '../../components/filtros-alojamientos/filtros-alojamientos';
import { FILTRO_VACIO, FiltroBusqueda } from '../../models/filtro-busqueda';
import { AlojamientoService } from '../../services/alojamiento.service';
import { FiltroAlojamientosService } from '../../services/filtro-alojamientos.service';

@Component({
  selector: 'app-listado-alojamientos',
  imports: [FiltrosAlojamientos, AlojamientoCard],
  templateUrl: './listado-alojamientos.html',
  styleUrl: './listado-alojamientos.css',
})
export class ListadoAlojamientos {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly filtroService = inject(FiltroAlojamientosService);

  readonly estaCargando = this.alojamientoService.estaCargando;
  readonly mensajeError = this.alojamientoService.mensajeError;

  readonly alojamientos = toSignal(this.alojamientoService.getAlojamientos(), { initialValue: [] });

  readonly filtro = signal<FiltroBusqueda>(FILTRO_VACIO);

  readonly ciudades = computed(() => this.valoresUnicos(this.alojamientos().map((a) => a.ciudad)));

  readonly tipos = computed(() => this.valoresUnicos(this.alojamientos().map((a) => a.tipo)));

  readonly alojamientosFiltrados = computed(() =>
    this.filtroService.aplicar(this.alojamientos(), this.filtro()),
  );

  private valoresUnicos<T extends string>(valores: T[]): T[] {
    return [...new Set(valores)].sort((a, b) => a.localeCompare(b, 'es'));
  }
}
