import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { ListadoAlojamientos } from './pages/listado-alojamientos/listado-alojamientos';
import { DetalleAlojamiento } from './pages/detalle-alojamiento/detalle-alojamiento';
import { MisReservas } from './pages/mis-reservas/mis-reservas';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'alojamientos', component: ListadoAlojamientos },
  { path: 'mis-reservas', component: MisReservas },
  { path: 'alojamientos/:id', component: DetalleAlojamiento },
  // con cualquier otra cosa se devuelve al incio
  { path: '**', redirectTo: '' },
];

