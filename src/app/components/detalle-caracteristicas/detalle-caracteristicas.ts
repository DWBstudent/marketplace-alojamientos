import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Alojamiento } from '../../models/alojamiento';

@Component({
  selector: 'app-detalle-caracteristicas',
  imports: [DecimalPipe],
  templateUrl: './detalle-caracteristicas.html',
  styleUrl: './detalle-caracteristicas.css',
})
export class DetalleCaracteristicas {
  readonly alojamiento = input.required<Alojamiento>();
}
