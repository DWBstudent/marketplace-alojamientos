import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { DetalleCaracteristicas } from '../../components/detalle-caracteristicas/detalle-caracteristicas';
import { DetalleServiciosReglas } from '../../components/detalle-servicios-reglas/detalle-servicios-reglas';

import { AlojamientoService } from '../../services/alojamiento.service';

@Component({
  selector: 'app-detalle-alojamiento',
  imports: [RouterLink, DetalleCaracteristicas, DetalleServiciosReglas],
  templateUrl: './detalle-alojamiento.html',
  styleUrl: './detalle-alojamiento.css',
})
export class DetalleAlojamiento {
  private readonly route = inject(ActivatedRoute);
  protected readonly alojamientoService = inject(AlojamientoService);

  protected readonly alojamiento = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.alojamientoService.getAlojamientoPorId(id)),
    ),
    { initialValue: undefined },
  );
}

