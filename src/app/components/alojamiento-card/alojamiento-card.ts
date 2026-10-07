import { DecimalPipe } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';

import { Alojamiento } from '../../models/alojamiento';

@Component({
  selector: 'app-alojamiento-card',
  imports: [DecimalPipe],
  templateUrl: './alojamiento-card.html',
  styleUrl: './alojamiento-card.css',
})
export class AlojamientoCard {
  readonly alojamiento = input.required<Alojamiento>();

  // Resets to false whenever the card receives a different lodging.
  protected readonly imagenFallida = linkedSignal({
    source: this.alojamiento,
    computation: () => false,
  });
}
