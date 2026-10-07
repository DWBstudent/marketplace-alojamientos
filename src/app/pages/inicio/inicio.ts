import { Component, inject } from '@angular/core';
import { RouterLink} from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { AlojamientoCard } from '../../components/alojamiento-card/alojamiento-card';
import { AlojamientoService } from '../../services/alojamiento.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, AlojamientoCard],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly alojamientoService = inject(AlojamientoService);
  protected readonly destacados = toSignal(this.alojamientoService.getDestacados(), {
    initialValue: [],
  });
}
