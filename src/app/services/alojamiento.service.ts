import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

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

  getAlojamientos(): Observable<Alojamiento[]> {
    return this.http
      .get<DatosMarketplace>(this.urlDatos)
      .pipe(map((datos) => datos.alojamientos.filter((alojamiento) => alojamiento.activo)));
  }
}
