import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of } from 'rxjs';

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

  private readonly estaCargandoSignal = signal(false);
  private readonly mensajeErrorSignal = signal<string | null>(null);

  readonly estaCargando = this.estaCargandoSignal.asReadonly();
  readonly mensajeError = this.mensajeErrorSignal.asReadonly();

  getAlojamientos(): Observable<Alojamiento[]> {
    this.iniciarSolicitud();

    return this.http.get<DatosMarketplace>(this.urlDatos).pipe(
      map((datos) =>
        datos.alojamientos.filter((alojamiento) => alojamiento.activo)
      ),
      catchError(() => {
        this.mensajeErrorSignal.set(
          'No fue posible cargar los alojamientos.'
        );

        return of([]);
      }),
      finalize(() => this.estaCargandoSignal.set(false))
    );
  }

  getAlojamientoPorId(id: number): Observable<Alojamiento | undefined> {
    this.iniciarSolicitud();

    return this.http.get<DatosMarketplace>(this.urlDatos).pipe(
      map((datos) =>
        datos.alojamientos.find(
          (alojamiento) => alojamiento.activo && alojamiento.id === id
        )
      ),
      catchError(() => {
        this.mensajeErrorSignal.set(
          'No fue posible cargar el alojamiento.'
        );

        return of(undefined);
      }),
      finalize(() => this.estaCargandoSignal.set(false))
    );
  }

  getResenasPorAlojamientoId(id: number): Observable<Resena[]> {
    this.iniciarSolicitud();

    return this.http.get<DatosMarketplace>(this.urlDatos).pipe(
      map((datos) =>
        datos.resenas.filter((resena) => resena.alojamientoId === id)
      ),
      catchError(() => {
        this.mensajeErrorSignal.set(
          'No fue posible cargar las reseñas.'
        );

        return of([]);
      }),
      finalize(() => this.estaCargandoSignal.set(false))
    );
  }

  private iniciarSolicitud(): void {
    this.estaCargandoSignal.set(true);
    this.mensajeErrorSignal.set(null);
  }
}
