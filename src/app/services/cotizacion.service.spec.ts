import { TestBed } from '@angular/core/testing';

import { CotizacionService } from './cotizacion.service';

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
});
