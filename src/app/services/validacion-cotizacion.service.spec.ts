import { TestBed } from '@angular/core/testing';

import { ValidacionCotizacionService } from './validacion-cotizacion.service';

function hoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

describe('ValidacionCotizacionService', () => {
  let service: ValidacionCotizacionService;

  const validos = { fechaLlegada: '2099-01-10', fechaSalida: '2099-01-12', huespedes: 2 };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionCotizacionService);
  });

  it('should return no errors for valid data', () => {
    expect(service.validar(validos, 4)).toEqual([]);
  });

  it('should require both dates', () => {
    const errores = service.validar({ ...validos, fechaSalida: '' }, 4);

    expect(errores).toEqual(['Selecciona las fechas de llegada y salida.']);
  });

  it('should reject a departure equal to the arrival', () => {
    const errores = service.validar({ ...validos, fechaSalida: validos.fechaLlegada }, 4);

    expect(errores).toEqual(['La fecha de salida debe ser posterior a la de llegada.']);
  });

  it('should reject a departure before the arrival', () => {
    const errores = service.validar({ ...validos, fechaSalida: '2099-01-05' }, 4);

    expect(errores).toEqual(['La fecha de salida debe ser posterior a la de llegada.']);
  });

  it('should reject an arrival in the past', () => {
    const errores = service.validar({ ...validos, fechaLlegada: '2000-01-01' }, 4);

    expect(errores).toEqual(['La fecha de llegada no puede ser anterior a hoy.']);
  });

  it('should accept an arrival today', () => {
    expect(service.validar({ ...validos, fechaLlegada: hoy() }, 4)).toEqual([]);
  });

  it('should reject zero guests', () => {
    const errores = service.validar({ ...validos, huespedes: 0 }, 4);

    expect(errores).toEqual(['El número de huéspedes debe ser mayor que cero.']);
  });

  it('should reject missing guests', () => {
    const errores = service.validar({ ...validos, huespedes: null }, 4);

    expect(errores).toEqual(['El número de huéspedes debe ser mayor que cero.']);
  });

  it('should reject more guests than the capacity', () => {
    const errores = service.validar({ ...validos, huespedes: 5 }, 4);

    expect(errores).toEqual(['Máximo 4 huéspedes para este alojamiento.']);
  });

  it('should accept guests equal to the capacity', () => {
    expect(service.validar({ ...validos, huespedes: 4 }, 4)).toEqual([]);
  });

  it('should report date and guest errors together', () => {
    const errores = service.validar(
      { fechaLlegada: '2000-01-01', fechaSalida: '2000-01-01', huespedes: 0 },
      4,
    );

    expect(errores).toHaveLength(3);
  });
});
