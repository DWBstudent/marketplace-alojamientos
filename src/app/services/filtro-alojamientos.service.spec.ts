import { TestBed } from '@angular/core/testing';

import { Alojamiento, TipoAlojamiento } from '../models/alojamiento';
import { FILTRO_VACIO } from '../models/filtro-busqueda';
import { FiltroAlojamientosService } from './filtro-alojamientos.service';

function crearAlojamiento(id: number, ciudad: string, tipo: TipoAlojamiento): Alojamiento {
  return {
    id,
    nombre: `Alojamiento ${id}`,
    descripcion: 'Descripcion de prueba',
    ciudad,
    ubicacion: 'Centro',
    tipo,
    capacidad: 4,
    habitaciones: 2,
    camas: 2,
    banos: 1,
    precioNoche: 100000,
    tarifaLimpieza: 20000,
    calificacion: 4.5,
    activo: true,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
  };
}

describe('FiltroAlojamientosService', () => {
  let service: FiltroAlojamientosService;

  const alojamientos = [
    crearAlojamiento(1, 'Bogotá', 'Apartamento'),
    crearAlojamiento(2, 'Cartagena', 'Apartamento'),
    crearAlojamiento(3, 'Guatapé', 'Cabaña'),
    crearAlojamiento(4, 'Bogotá', 'Casa'),
  ];

  const ids = (lista: Alojamiento[]) => lista.map((alojamiento) => alojamiento.id);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltroAlojamientosService);
  });

  it('should return every lodging when there is no filter', () => {
    expect(ids(service.aplicar(alojamientos, FILTRO_VACIO))).toEqual([1, 2, 3, 4]);
  });

  it('should filter by city', () => {
    const filtro = { ...FILTRO_VACIO, ciudad: 'Bogotá' };

    expect(ids(service.aplicar(alojamientos, filtro))).toEqual([1, 4]);
  });

  it('should filter by type', () => {
    const filtro = { ...FILTRO_VACIO, tipo: 'Apartamento' as const };

    expect(ids(service.aplicar(alojamientos, filtro))).toEqual([1, 2]);
  });

  it('should combine city and type', () => {
    const filtro = { ...FILTRO_VACIO, ciudad: 'Bogotá', tipo: 'Casa' as const };

    expect(ids(service.aplicar(alojamientos, filtro))).toEqual([4]);
  });

  it('should return an empty list when nothing matches', () => {
    const filtro = { ...FILTRO_VACIO, ciudad: 'Guatapé', tipo: 'Casa' as const };

    expect(service.aplicar(alojamientos, filtro)).toEqual([]);
  });
  it('should return an empty filter when clearing', () => {
    expect(service.limpiar()).toEqual(FILTRO_VACIO);
  });
});
