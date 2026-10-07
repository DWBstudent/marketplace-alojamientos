import { Component, computed, input } from '@angular/core';

import { Resena } from '../../models/resena';

@Component({
  selector: 'app-resenas-alojamiento',
  templateUrl: './resenas-alojamiento.html',
  styleUrl: './resenas-alojamiento.css',
})
export class ResenasAlojamiento {
  readonly calificacion = input.required<number>();
  readonly resenas = input.required<Resena[]>();

  readonly cantidad = computed(() => this.resenas().length);
}
