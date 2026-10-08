import { TestBed } from '@angular/core/testing';

import { Alojamiento } from '../models/alojamiento';
import { DatosEstancia } from '../models/estancia';
import { CotizacionService } from './cotizacion.service';

function crearAlojamiento(cambios: Partial<Alojamiento> = {}): Alojamiento {
  return {
    id: 1,
    nombre: 'Alojamiento 1',
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

function crearEstancia(fechaLlegada: string, fechaSalida: string): DatosEstancia {
  return { fechaLlegada, fechaSalida, huespedes: 2 };
}

describe('CotizacionService', () => {
  let service: CotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotizacionService);
  });

  describe('calcularNoches', () => {
    it('should count the nights between two dates', () => {
      expect(service.calcularNoches('2026-11-10', '2026-11-13')).toBe(3);
    });

    it('should count one night for consecutive days', () => {
      expect(service.calcularNoches('2026-11-10', '2026-11-11')).toBe(1);
    });

    it('should count across a change of month', () => {
      expect(service.calcularNoches('2026-11-28', '2026-12-02')).toBe(4);
      expect(service.calcularNoches('2026-01-30', '2026-02-02')).toBe(3);
    });

    it('should count across a change of year', () => {
      expect(service.calcularNoches('2026-12-30', '2027-01-02')).toBe(3);
      expect(service.calcularNoches('2026-12-31', '2027-01-01')).toBe(1);
    });

    it('should count February of leap and non-leap years', () => {
      expect(service.calcularNoches('2028-02-28', '2028-03-01')).toBe(2);
      expect(service.calcularNoches('2027-02-28', '2027-03-01')).toBe(1);
    });

    it('should not be affected by daylight saving time changes', () => {
      expect(service.calcularNoches('2026-03-07', '2026-03-09')).toBe(2);
      expect(service.calcularNoches('2026-10-31', '2026-11-02')).toBe(2);
    });

    it('should give zero nights for the same day', () => {
      expect(service.calcularNoches('2026-11-10', '2026-11-10')).toBe(0);
    });

    it('should give a negative number when the departure is before the arrival', () => {
      expect(service.calcularNoches('2026-11-13', '2026-11-10')).toBe(-3);
    });

    it('should give zero nights when a date is empty, malformed or not real', () => {
      expect(service.calcularNoches('', '2026-11-10')).toBe(0);
      expect(service.calcularNoches('2026-11-10', '10/11/2026')).toBe(0);
      expect(service.calcularNoches('2026-02-31', '2026-03-05')).toBe(0);
    });
  });

  describe('calcular', () => {
    it('should calculate nights, subtotal, cleaning fee, 10 % service fee and total', () => {
      const cotizacion = service.calcular(
        crearAlojamiento(),
        crearEstancia('2026-11-10', '2026-11-13'),
      );

      expect(cotizacion).toEqual({
        noches: 3,
        subtotal: 540000,
        tarifaLimpieza: 45000,
        tarifaServicio: 54000,
        total: 639000,
      });
    });

    it('should quote a stay that changes month', () => {
      const cotizacion = service.calcular(
        crearAlojamiento(),
        crearEstancia('2026-11-28', '2026-12-02'),
      );

      expect(cotizacion.noches).toBe(4);
      expect(cotizacion.subtotal).toBe(720000);
      expect(cotizacion.tarifaServicio).toBe(72000);
      expect(cotizacion.total).toBe(720000 + 45000 + 72000);
    });

    it('should quote a stay that changes year', () => {
      const cotizacion = service.calcular(
        crearAlojamiento({ precioNoche: 350000, tarifaLimpieza: 60000 }),
        crearEstancia('2026-12-30', '2027-01-02'),
      );

      expect(cotizacion.noches).toBe(3);
      expect(cotizacion.subtotal).toBe(1050000);
      expect(cotizacion.tarifaServicio).toBe(105000);
      expect(cotizacion.total).toBe(1050000 + 60000 + 105000);
    });

    it('should charge the service fee over the subtotal only, not over the cleaning fee', () => {
      const cotizacion = service.calcular(
        crearAlojamiento({ tarifaLimpieza: 1000000 }),
        crearEstancia('2026-11-10', '2026-11-11'),
      );

      expect(cotizacion.tarifaServicio).toBe(18000);
    });

    it('should round the service fee to whole pesos', () => {
      const cotizacion = service.calcular(
        crearAlojamiento({ precioNoche: 333, tarifaLimpieza: 0 }),
        crearEstancia('2026-11-10', '2026-11-11'),
      );

      expect(cotizacion.tarifaServicio).toBe(33);
      expect(cotizacion.total).toBe(366);
    });
  });

  describe('cotizar', () => {
    it('should give the same quote as calcular for a stay with nights', () => {
      const estancia = crearEstancia('2026-11-10', '2026-11-12');

      expect(service.cotizar(crearAlojamiento(), estancia)).toEqual(
        service.calcular(crearAlojamiento(), estancia),
      );
    });

    it('should not quote a stay without nights', () => {
      expect(
        service.cotizar(crearAlojamiento(), crearEstancia('2026-11-12', '2026-11-12')),
      ).toBeNull();
      expect(
        service.cotizar(crearAlojamiento(), crearEstancia('2026-11-12', '2026-11-10')),
      ).toBeNull();
      expect(service.cotizar(crearAlojamiento(), crearEstancia('', ''))).toBeNull();
    });

    it('should not quote a lodging whose price per night is not positive', () => {
      const alojamiento = crearAlojamiento({ precioNoche: 0 });

      expect(service.cotizar(alojamiento, crearEstancia('2026-11-10', '2026-11-12'))).toBeNull();
    });
  });

  describe('with the prices of the project lodgings', () => {
    const casos = [
      {
        id: 1,
        precioNoche: 180000,
        tarifaLimpieza: 45000,
        llegada: '2026-11-10',
        salida: '2026-11-13',
        noches: 3,
        subtotal: 540000,
        servicio: 54000,
        total: 639000,
      },
      {
        id: 2,
        precioNoche: 420000,
        tarifaLimpieza: 70000,
        llegada: '2026-11-28',
        salida: '2026-12-02',
        noches: 4,
        subtotal: 1680000,
        servicio: 168000,
        total: 1918000,
      },
      {
        id: 3,
        precioNoche: 350000,
        tarifaLimpieza: 60000,
        llegada: '2026-12-30',
        salida: '2027-01-02',
        noches: 3,
        subtotal: 1050000,
        servicio: 105000,
        total: 1215000,
      },
      {
        id: 4,
        precioNoche: 520000,
        tarifaLimpieza: 90000,
        llegada: '2027-02-26',
        salida: '2027-03-02',
        noches: 4,
        subtotal: 2080000,
        servicio: 208000,
        total: 2378000,
      },
      {
        id: 5,
        precioNoche: 230000,
        tarifaLimpieza: 50000,
        llegada: '2028-02-27',
        salida: '2028-03-01',
        noches: 3,
        subtotal: 690000,
        servicio: 69000,
        total: 809000,
      },
    ];

    for (const caso of casos) {
      it(`should quote the lodging ${caso.id} from ${caso.llegada} to ${caso.salida}`, () => {
        const alojamiento = crearAlojamiento({
          id: caso.id,
          precioNoche: caso.precioNoche,
          tarifaLimpieza: caso.tarifaLimpieza,
        });

        const cotizacion = service.calcular(alojamiento, crearEstancia(caso.llegada, caso.salida));

        expect(cotizacion).toEqual({
          noches: caso.noches,
          subtotal: caso.subtotal,
          tarifaLimpieza: caso.tarifaLimpieza,
          tarifaServicio: caso.servicio,
          total: caso.total,
        });
      });
    }
  });

});
