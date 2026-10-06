import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, defer, finalize, map, of } from 'rxjs';

import { Alojamiento } from '../models/alojamiento';
import { Resena } from '../models/resena';

interface DatosMarketplace {
  alojamientos: Alojamiento[];
  resenas: Resena[];
}

@Injectable({ providedIn: 'root' })
export class AlojamientoService {
  private readonly http = inject(HttpClient);
  private readonly urlDatos = 'data/marketplace-data.json';

  private readonly solicitudesPendientes = signal(0);
  private readonly mensajeErrorSignal = signal<string | null>(null);

  readonly estaCargando = computed(() => this.solicitudesPendientes() > 0);
  readonly mensajeError = this.mensajeErrorSignal.asReadonly();

  getAlojamientos(): Observable<Alojamiento[]> {
    return this.conEstado(
      () =>
        this.http
          .get<DatosMarketplace>(this.urlDatos)
          .pipe(map((datos) => datos.alojamientos.filter((alojamiento) => alojamiento.activo))),
      'No pudimos cargar los alojamientos. Intenta de nuevo.',
      [],
    );
  }

  getAlojamientoPorId(id: number): Observable<Alojamiento | undefined> {
    return this.conEstado(
      () =>
        this.http
          .get<DatosMarketplace>(this.urlDatos)
          .pipe(
            map((datos) =>
              datos.alojamientos.find((alojamiento) => alojamiento.activo && alojamiento.id === id),
            ),
          ),
      'No fue posible cargar el alojamiento.',
      undefined,
    );
  }

  getResenasPorAlojamientoId(id: number): Observable<Resena[]> {
    return this.conEstado(
      () =>
        this.http
          .get<DatosMarketplace>(this.urlDatos)
          .pipe(map((datos) => datos.resenas.filter((resena) => resena.alojamientoId === id))),
      'No fue posible cargar las reseñas.',
      [],
    );
  }

  private conEstado<T>(
    solicitud: () => Observable<T>,
    mensajeError: string,
    valorError: T,
  ): Observable<T> {
    return defer(() => {
      this.solicitudesPendientes.update((pendientes) => pendientes + 1);
      this.mensajeErrorSignal.set(null);

      return solicitud().pipe(
        catchError(() => {
          this.mensajeErrorSignal.set(mensajeError);
          return of(valorError);
        }),
        finalize(() => {
          this.solicitudesPendientes.update((pendientes) => pendientes - 1);
        }),
      );
    });
  }
}
