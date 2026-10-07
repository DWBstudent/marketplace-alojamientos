import { Component, input } from '@angular/core';

import { Alojamiento } from '../../models/alojamiento';

@Component({
  selector: 'app-detalle-servicios-reglas',
  templateUrl: './detalle-servicios-reglas.html',
  styleUrl: './detalle-servicios-reglas.css',
})
export class DetalleServiciosReglas {
  readonly alojamiento = input.required<Alojamiento>();
}
