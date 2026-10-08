import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { DetalleCaracteristicas } from '../../components/detalle-caracteristicas/detalle-caracteristicas';
import { DetalleServiciosReglas } from '../../components/detalle-servicios-reglas/detalle-servicios-reglas';
import { FormularioCotizacion } from '../../components/formulario-cotizacion/formulario-cotizacion';
import { Cotizacion } from '../../models/cotizacion';
import { DatosEstancia, ErroresEstancia } from '../../models/estancia';
import { AlojamientoService } from '../../services/alojamiento.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { ValidacionCotizacionService } from '../../services/validacion-cotizacion.service';

@Component({
  selector: 'app-detalle-alojamiento',
  imports: [
    RouterLink,
    DetalleCaracteristicas,
    DetalleServiciosReglas,
    FormularioCotizacion,
    DecimalPipe,
  ],
  templateUrl: './detalle-alojamiento.html',
  styleUrl: './detalle-alojamiento.css',
})
export class DetalleAlojamiento {
  private readonly route = inject(ActivatedRoute);
  protected readonly alojamientoService = inject(AlojamientoService);
  private readonly cotizacionService = inject(CotizacionService);
  private readonly validacionService = inject(ValidacionCotizacionService);

  protected readonly alojamiento = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.alojamientoService.getAlojamientoPorId(id)),
    ),
    { initialValue: undefined },
  );

  protected readonly errores = signal<ErroresEstancia>({});
  protected readonly cotizacion = signal<Cotizacion | null>(null);

  protected readonly hoy = computed(() => {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');

    return `${ahora.getFullYear()}-${mes}-${dia}`;
  });

  protected cotizar(estancia: DatosEstancia): void {
    const alojamiento = this.alojamiento();

    if (!alojamiento) {
      return;
    }

    const errores = this.validacionService.validar(estancia, alojamiento.capacidad);

    this.errores.set(errores);

    if (Object.keys(errores).length > 0) {
      this.cotizacion.set(null);
      return;
    }

    this.cotizacion.set(this.cotizacionService.cotizar(alojamiento, estancia));
  }
}
