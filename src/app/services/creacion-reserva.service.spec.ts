import { TestBed } from '@angular/core/testing';

import { Alojamiento } from '../models/alojamiento';
import { Cotizacion } from '../models/cotizacion';
import { DatosEstancia } from '../models/estancia';
import { DatosHuesped } from '../models/huesped';
import { CreacionReservaService } from './creacion-reserva.service';

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

describe('CreacionReservaService', () => {
  let service: CreacionReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreacionReservaService);
  });

  describe('construirDatosReserva', () => {
    it('should carry the basic information of the lodging', () => {
      const datos = service.construirDatosReserva(
        crearAlojamiento(),
        ESTANCIA,
        COTIZACION,
        HUESPED,
      );

      expect(datos.alojamientoId).toBe(7);
      expect(datos.alojamientoNombre).toBe('Apartamento Chapinero');
      expect(datos.ciudad).toBe('Bogotá');
    });

    it('should carry the dates, guests, nights and total of the quote', () => {
      const datos = service.construirDatosReserva(
        crearAlojamiento(),
        ESTANCIA,
        COTIZACION,
        HUESPED,
      );

      expect(datos.fechaLlegada).toBe('2026-12-30');
      expect(datos.fechaSalida).toBe('2027-01-02');
      expect(datos.huespedes).toBe(2);
      expect(datos.noches).toBe(3);
      expect(datos.total).toBe(639000);
    });

    it('should carry the guest name and email', () => {
      const datos = service.construirDatosReserva(
        crearAlojamiento(),
        ESTANCIA,
        COTIZACION,
        HUESPED,
      );

      expect(datos.nombreHuesped).toBe('Andrés Neisa');
      expect(datos.correoHuesped).toBe('andres@correo.com');
    });

    it('should trim the guest name and email', () => {
      const datos = service.construirDatosReserva(crearAlojamiento(), ESTANCIA, COTIZACION, {
        nombreHuesped: '  Andrés Neisa ',
        correoHuesped: ' andres@correo.com  ',
      });

      expect(datos.nombreHuesped).toBe('Andrés Neisa');
      expect(datos.correoHuesped).toBe('andres@correo.com');
    });

    it('should not include an id or a state, ReservaService adds them', () => {
      const datos = service.construirDatosReserva(
        crearAlojamiento(),
        ESTANCIA,
        COTIZACION,
        HUESPED,
      );

      expect('id' in datos).toBe(false);
      expect('estado' in datos).toBe(false);
    });
  });
});
