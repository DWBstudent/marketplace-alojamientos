import { TestBed } from '@angular/core/testing';

import { Alojamiento } from '../models/alojamiento';
import { Cotizacion } from '../models/cotizacion';
import { DatosEstancia } from '../models/estancia';
import { DatosHuesped } from '../models/huesped';
import { CreacionReservaService } from './creacion-reserva.service';
import { ReservaService } from './reserva.service';

function crearAlojamiento(cambios: Partial<Alojamiento> = {}): Alojamiento {
  return {
    id: 7,
    nombre: 'Apartamento Chapinero',
    descripcion: 'Descripcion de prueba',
    ciudad: 'Bogotá',
    ubicacion: 'Chapinero, Bogotá',
    tipo: 'Apartamento',
    capacidad: 4,
    habitaciones: 2,
    camas: 2,
    banos: 1,
    precioNoche: 180000,
    tarifaLimpieza: 45000,
    calificacion: 4.5,
    activo: true,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
    ...cambios,
  };
}

const ESTANCIA: DatosEstancia = {
  fechaLlegada: '2026-12-30',
  fechaSalida: '2027-01-02',
  huespedes: 2,
};

const COTIZACION: Cotizacion = {
  noches: 3,
  subtotal: 540000,
  tarifaLimpieza: 45000,
  tarifaServicio: 54000,
  total: 639000,
};

const HUESPED: DatosHuesped = {
  nombreHuesped: 'Andrés Neisa',
  correoHuesped: 'andres@correo.com',
};

describe('Persistencia de reservas', () => {
  let service: CreacionReservaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreacionReservaService);
  });

  it('should store the reservation in localStorage', () => {
    const { reserva } = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

    const guardadas = JSON.parse(localStorage.getItem('marketplace-reservas') ?? '[]');

    expect(guardadas).toEqual([reserva]);
  });

  it('should keep the reservations after a reload', () => {
    const { reserva } = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

    // A reload creates the services again; they must read what was saved.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const despuesDeRecargar = TestBed.inject(ReservaService);

    expect(despuesDeRecargar.reservas()).toEqual([reserva!]);
  });

  it('should add a new reservation without losing the previous ones', () => {
    const primera = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const servicioNuevo = TestBed.inject(CreacionReservaService);
    const segunda = servicioNuevo.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

    const guardadas = TestBed.inject(ReservaService).reservas();

    expect(guardadas.map((r) => r.id)).toEqual([primera.reserva!.id, segunda.reserva!.id]);
  });

  it('should not store anything when the reservation is rejected', () => {
    service.reservar(crearAlojamiento(), ESTANCIA, null, HUESPED);

    expect(localStorage.getItem('marketplace-reservas')).toBeNull();
  });
});
