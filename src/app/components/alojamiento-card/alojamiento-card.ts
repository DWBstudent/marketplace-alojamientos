import { DecimalPipe } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alojamiento } from '../../models/alojamiento';

@Component({
  selector: 'app-alojamiento-card',
  imports: [DecimalPipe,RouterLink],
  templateUrl: './alojamiento-card.html',
  styleUrl: './alojamiento-card.css',
})
export class AlojamientoCard {
  readonly alojamiento = input.required<Alojamiento>();
  protected readonly imagenFallida = linkedSignal({
    source: this.alojamiento,
    computation: () => false,
  });
}
