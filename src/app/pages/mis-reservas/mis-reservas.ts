import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-mis-reservas',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css'
})
export class MisReservas {
  private readonly reservaService = inject(ReservaService);
  readonly reservas = this.reservaService.reservas;
}
