import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlojamientoService } from '../../services/alojamiento.service';

@Component({
  selector: 'app-listado-alojamientos',
  imports: [],
  templateUrl: './listado-alojamientos.html',
  styleUrl: './listado-alojamientos.css'
})
export class ListadoAlojamientos {
  private readonly alojamientoService = inject(AlojamientoService);
  readonly alojamientos = toSignal(this.alojamientoService.getAlojamientos(), { initialValue: [] });
}
