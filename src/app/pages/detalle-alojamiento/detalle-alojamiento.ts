import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { DetalleCaracteristicas } from '../../components/detalle-caracteristicas/detalle-caracteristicas';
import { DetalleServiciosReglas } from '../../components/detalle-servicios-reglas/detalle-servicios-reglas';
import { FormularioCotizacion } from '../../components/formulario-cotizacion/formulario-cotizacion';
import { FormularioHuesped } from '../../components/formulario-huesped/formulario-huesped';
import { Cotizacion } from '../../models/cotizacion';
import { DatosEstancia, ErroresEstancia } from '../../models/estancia';
import { DatosHuesped } from '../../models/huesped';
import { AlojamientoService } from '../../services/alojamiento.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { ReservaService } from '../../services/reserva.service';
import { ValidacionCotizacionService } from '../../services/validacion-cotizacion.service';

@Component({
  selector: 'app-detalle-alojamiento',
  imports: [
    RouterLink,
    DetalleCaracteristicas,
    DetalleServiciosReglas,
    FormularioCotizacion,
    FormularioHuesped,
    DecimalPipe,
  ],
  templateUrl: './detalle-alojamiento.html',
  styleUrl: './detalle-alojamiento.css',
})
export class DetalleAlojamiento {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly alojamientoService = inject(AlojamientoService);
  private readonly cotizacionService = inject(CotizacionService);
  private readonly validacionService = inject(ValidacionCotizacionService);
  private readonly reservaService = inject(ReservaService);

  protected readonly alojamiento = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.alojamientoService.getAlojamientoPorId(id)),
    ),
    { initialValue: undefined },
  );

  protected readonly errores = signal<ErroresEstancia>({});
  protected readonly cotizacion = signal<Cotizacion | null>(null);
  // The stay that produced the quotation. The reservation is built from it, not from the
  // form, so it always matches the amounts the user saw.
  private readonly estanciaCotizada = signal<DatosEstancia | null>(null);
  protected readonly errorReserva = signal<string | null>(null);

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
      this.descartarCotizacion();
      return;
    }

    const resultado = this.cotizacionService.cotizar(alojamiento, estancia);

    this.cotizacion.set(resultado);
    this.estanciaCotizada.set(resultado === null ? null : { ...estancia });
    this.errorReserva.set(null);
  }

  // A quotation is only valid for the stay that produced it: when the user edits the form
  // it is dropped, and the reserve button is disabled until a new one is generated.
  protected descartarCotizacion(): void {
    this.cotizacion.set(null);
    this.estanciaCotizada.set(null);
    this.errorReserva.set(null);
  }

  protected reservar(huesped: DatosHuesped): void {
    const alojamiento = this.alojamiento();
    const estancia = this.estanciaCotizada();
    const cotizacion = this.cotizacion();

    if (!alojamiento || !estancia || !cotizacion || estancia.huespedes === null) {
      return;
    }

    this.reservaService.crearReserva({
      alojamientoId: alojamiento.id,
      alojamientoNombre: alojamiento.nombre,
      ciudad: alojamiento.ciudad,
      fechaLlegada: estancia.fechaLlegada,
      fechaSalida: estancia.fechaSalida,
      huespedes: estancia.huespedes,
      noches: cotizacion.noches,
      total: cotizacion.total,
      nombreHuesped: huesped.nombreHuesped,
      correoHuesped: huesped.correoHuesped,
    });

    // The service sets the error when the reservation could not be saved.
    this.errorReserva.set(this.reservaService.error());

    if (this.errorReserva() === null) {
      void this.router.navigateByUrl('/mis-reservas');
    }
  }
}
