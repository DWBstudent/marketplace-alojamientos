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

  it('should filter by number of guests using the capacity', () => {
    const lista = [
      { ...crearAlojamiento(1, 'Bogotá', 'Apartamento'), capacidad: 2 },
      { ...crearAlojamiento(2, 'Cartagena', 'Apartamento'), capacidad: 5 },
      { ...crearAlojamiento(3, 'Guatapé', 'Cabaña'), capacidad: 6 },
    ];
    const filtro = { ...FILTRO_VACIO, huespedes: 5 };

    expect(ids(service.aplicar(lista, filtro))).toEqual([2, 3]);
  });

  it('should filter by maximum price per night, including the limit', () => {
    const lista = [
      { ...crearAlojamiento(1, 'Bogotá', 'Apartamento'), precioNoche: 180000 },
      { ...crearAlojamiento(2, 'Cartagena', 'Apartamento'), precioNoche: 420000 },
      { ...crearAlojamiento(3, 'Guatapé', 'Cabaña'), precioNoche: 350000 },
    ];
    const filtro = { ...FILTRO_VACIO, precioMaximo: 350000 };

    expect(ids(service.aplicar(lista, filtro))).toEqual([1, 3]);
  });

  it('should combine guests, maximum price, city and type', () => {
    const lista = [
      { ...crearAlojamiento(1, 'Bogotá', 'Casa'), capacidad: 8, precioNoche: 520000 },
      { ...crearAlojamiento(2, 'Bogotá', 'Casa'), capacidad: 8, precioNoche: 300000 },
      { ...crearAlojamiento(3, 'Bogotá', 'Casa'), capacidad: 2, precioNoche: 300000 },
      { ...crearAlojamiento(4, 'Bogotá', 'Apartamento'), capacidad: 8, precioNoche: 300000 },
      { ...crearAlojamiento(5, 'Medellín', 'Casa'), capacidad: 8, precioNoche: 300000 },
    ];
    const filtro = {
      ciudad: 'Bogotá',
      tipo: 'Casa' as const,
      huespedes: 6,
      precioMaximo: 400000,
    };

    expect(ids(service.aplicar(lista, filtro))).toEqual([2]);
  });

  it('should return an empty list when nothing matches', () => {
    const filtro = { ...FILTRO_VACIO, ciudad: 'Guatapé', tipo: 'Casa' as const };

    expect(service.aplicar(alojamientos, filtro)).toEqual([]);
  });
});
