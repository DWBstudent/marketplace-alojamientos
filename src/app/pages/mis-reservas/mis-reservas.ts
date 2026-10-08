import { Component, inject } from '@angular/core';

import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-mis-reservas',
  imports: [],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css',
})
export class MisReservas {
  protected readonly reservaService = inject(ReservaService);
}
