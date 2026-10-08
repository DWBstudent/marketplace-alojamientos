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

describe('CreacionReservaService', () => {
  let service: CreacionReservaService;
  let reservaService: ReservaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreacionReservaService);
    reservaService = TestBed.inject(ReservaService);
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

  describe('reservar', () => {
    it('should create a CONFIRMADA reservation with an id', () => {
      const resultado = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

      expect(resultado.error).toBeNull();
      expect(resultado.reserva?.estado).toBe('CONFIRMADA');
      expect(resultado.reserva?.id).toBeTruthy();
    });

    it('should save the reservation through ReservaService', () => {
      const resultado = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

      expect(reservaService.reservas()).toEqual([resultado.reserva!]);
    });

    it('should save every minimum field of section 3.5', () => {
      const { reserva } = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

      expect(reserva).toEqual({
        id: reserva!.id,
        alojamientoId: 7,
        alojamientoNombre: 'Apartamento Chapinero',
        ciudad: 'Bogotá',
        fechaLlegada: '2026-12-30',
        fechaSalida: '2027-01-02',
        huespedes: 2,
        noches: 3,
        total: 639000,
        estado: 'CONFIRMADA',
        nombreHuesped: 'Andrés Neisa',
        correoHuesped: 'andres@correo.com',
      });
    });

    it('should give a different id to each reservation', () => {
      const primera = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);
      const segunda = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, HUESPED);

      expect(primera.reserva!.id).not.toBe(segunda.reserva!.id);
      expect(reservaService.reservas()).toHaveLength(2);
    });

    it('should not reserve without a quote', () => {
      const resultado = service.reservar(crearAlojamiento(), ESTANCIA, null, HUESPED);

      expect(resultado.reserva).toBeNull();
      expect(resultado.error).toBe('Primero genera una cotización válida.');
      expect(reservaService.reservas()).toEqual([]);
    });

    it('should not reserve when the quote does not match the stay', () => {
      const cotizacionAlterada: Cotizacion = { ...COTIZACION, total: 1000 };

      const resultado = service.reservar(crearAlojamiento(), ESTANCIA, cotizacionAlterada, HUESPED);

      expect(resultado.reserva).toBeNull();
      expect(reservaService.reservas()).toEqual([]);
    });

    it('should not reserve a stay without nights', () => {
      const sinNoches: DatosEstancia = {
        ...ESTANCIA,
        fechaSalida: ESTANCIA.fechaLlegada,
      };
      const cotizacionVacia: Cotizacion = {
        ...COTIZACION,
        noches: 0,
        subtotal: 0,
        total: 0,
      };

      const resultado = service.reservar(crearAlojamiento(), sinNoches, cotizacionVacia, HUESPED);

      expect(resultado.reserva).toBeNull();
      expect(reservaService.reservas()).toEqual([]);
    });

    it('should not reserve an inactive lodging', () => {
      const resultado = service.reservar(
        crearAlojamiento({ activo: false }),
        ESTANCIA,
        COTIZACION,
        HUESPED,
      );

      expect(resultado.reserva).toBeNull();
      expect(resultado.error).toBe('Este alojamiento ya no está disponible.');
    });

    it('should not reserve with zero guests or with null guests', () => {
      const alojamiento = crearAlojamiento();

      expect(
        service.reservar(alojamiento, { ...ESTANCIA, huespedes: 0 }, COTIZACION, HUESPED).reserva,
      ).toBeNull();
      expect(
        service.reservar(alojamiento, { ...ESTANCIA, huespedes: null }, COTIZACION, HUESPED)
          .reserva,
      ).toBeNull();
      expect(reservaService.reservas()).toEqual([]);
    });

    it('should not reserve more guests than the capacity', () => {
      const resultado = service.reservar(
        crearAlojamiento({ capacidad: 4 }),
        { ...ESTANCIA, huespedes: 5 },
        COTIZACION,
        HUESPED,
      );

      expect(resultado.reserva).toBeNull();
      expect(resultado.error).toBe('El número de huéspedes supera la capacidad del alojamiento.');
    });

    it('should accept exactly the capacity of the lodging', () => {
      const resultado = service.reservar(
        crearAlojamiento({ capacidad: 2 }),
        { ...ESTANCIA, huespedes: 2 },
        COTIZACION,
        HUESPED,
      );

      expect(resultado.reserva).not.toBeNull();
    });

    it('should not reserve without the guest name', () => {
      const resultado = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, {
        ...HUESPED,
        nombreHuesped: '   ',
      });

      expect(resultado.reserva).toBeNull();
      expect(resultado.error).toBe('El nombre del huésped es obligatorio.');
    });

    it('should not reserve with an invalid email', () => {
      const resultado = service.reservar(crearAlojamiento(), ESTANCIA, COTIZACION, {
        ...HUESPED,
        correoHuesped: 'andres-sin-arroba',
      });

      expect(resultado.reserva).toBeNull();
      expect(resultado.error).toBe('Escribe un correo electrónico válido.');
    });
  });
});
