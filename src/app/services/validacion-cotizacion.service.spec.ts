import { TestBed } from '@angular/core/testing';

import { DatosEstancia } from '../models/estancia';
import { ValidacionCotizacionService } from './validacion-cotizacion.service';

function hoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

describe('ValidacionCotizacionService', () => {
  let service: ValidacionCotizacionService;

  const validos: DatosEstancia = {
    fechaLlegada: '2099-01-10',
    fechaSalida: '2099-01-12',
    huespedes: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionCotizacionService);
  });

  it('should return no errors for valid data', () => {
    expect(service.validar(validos, 4)).toEqual({});
  });

  it('should require both dates, each under its own field', () => {
    expect(service.validar({ ...validos, fechaLlegada: '', fechaSalida: '' }, 4)).toEqual({
      fechaLlegada: 'Selecciona la fecha de llegada.',
      fechaSalida: 'Selecciona la fecha de salida.',
    });
  });

  it('should reject a departure equal to the arrival', () => {
    expect(service.validar({ ...validos, fechaSalida: validos.fechaLlegada }, 4)).toEqual({
      fechaSalida: 'La fecha de salida debe ser posterior a la de llegada.',
    });
  });

  it('should reject a departure before the arrival', () => {
    expect(service.validar({ ...validos, fechaSalida: '2099-01-05' }, 4)).toEqual({
      fechaSalida: 'La fecha de salida debe ser posterior a la de llegada.',
    });
  });

  it('should reject an arrival in the past', () => {
    expect(service.validar({ ...validos, fechaLlegada: '2000-01-01' }, 4)).toEqual({
      fechaLlegada: 'La fecha de llegada no puede ser anterior a hoy.',
    });
  });

  it('should accept an arrival today', () => {
    expect(service.validar({ ...validos, fechaLlegada: hoy() }, 4)).toEqual({});
  });

  it('should reject zero or missing guests', () => {
    const mensaje = { huespedes: 'El número de huéspedes debe ser mayor que cero.' };

    expect(service.validar({ ...validos, huespedes: 0 }, 4)).toEqual(mensaje);
    expect(service.validar({ ...validos, huespedes: null }, 4)).toEqual(mensaje);
  });

  it('should reject more guests than the capacity', () => {
    expect(service.validar({ ...validos, huespedes: 5 }, 4)).toEqual({
      huespedes: 'Máximo 4 huéspedes para este alojamiento.',
    });
  });

  it('should use the singular when the capacity is one', () => {
    expect(service.validar({ ...validos, huespedes: 2 }, 1)).toEqual({
      huespedes: 'Máximo 1 huésped para este alojamiento.',
    });
  });

  it('should accept guests equal to the capacity', () => {
    expect(service.validar({ ...validos, huespedes: 4 }, 4)).toEqual({});
  });

  it('should report every field with an error at once', () => {
    const errores = service.validar(
      { fechaLlegada: '2000-01-01', fechaSalida: '2000-01-01', huespedes: 0 },
      4,
    );

    expect(Object.keys(errores).sort()).toEqual(['fechaLlegada', 'fechaSalida', 'huespedes']);
  });
});
