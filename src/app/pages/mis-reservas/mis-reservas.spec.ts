
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reserva } from '../../models/reserva';
import { ReservaService } from '../../services/reserva.service';
import { MisReservas } from './mis-reservas';

function crearReserva(): Omit<Reserva, 'id' | 'estado'> {
  return {
    alojamientoId: 1,
    alojamientoNombre: 'Loft moderno en Chapinero',
    ciudad: 'Bogotá',
    fechaLlegada: '2099-11-10',
    fechaSalida: '2099-11-12',
    huespedes: 2,
    noches: 2,
    total: 240000,
    nombreHuesped: 'Daniel Zapata',
    correoHuesped: 'daniel@example.com',
  };
}

describe('MisReservas', () => {
  let fixture: ComponentFixture<MisReservas>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MisReservas],
    }).compileComponents();

    fixture = TestBed.createComponent(MisReservas);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an empty message when there are no reservations', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'No tienes reservas todavía',
    );
  });

  it('should not show the empty message when there is a reservation', () => {
    const reservaService = TestBed.inject(ReservaService);

    reservaService.crearReserva(crearReserva());

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain(
      'No tienes reservas todavía',
    );
  });

  it('should persist reservations in localStorage', () => {
    const reservaService = TestBed.inject(ReservaService);

    const reserva = reservaService.crearReserva(crearReserva());

    const guardadas = JSON.parse(
      localStorage.getItem('marketplace-reservas') ?? '[]',
    ) as Reserva[];

    expect(guardadas).toHaveLength(1);
    expect(guardadas[0]).toEqual(reserva);
  });

  it('should restore reservations from localStorage after recreating the service', () => {
    const reservaService = TestBed.inject(ReservaService);

    const reserva = reservaService.crearReserva(crearReserva());

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [ReservaService],
    });

    const nuevoServicio = TestBed.inject(ReservaService);

    expect(nuevoServicio.reservas()).toEqual([reserva]);
  });

  describe('MisReservas with saved reservations', () => {
    const reserva: Reserva = {
      id: '1',
      alojamientoId: 1,
      alojamientoNombre: 'Casa Prueba',
      ciudad: 'Yopal',
      fechaLlegada: '2099-01-10',
      fechaSalida: '2099-01-12',
      huespedes: 2,
      noches: 2,
      total: 500000,
      estado: 'CONFIRMADA',
      nombreHuesped: 'Ana',
      correoHuesped: 'ana@correo.com',
    };

    beforeEach(async () => {
      TestBed.resetTestingModule();
      localStorage.clear();

      localStorage.setItem(
        'marketplace-reservas',
        JSON.stringify([reserva]),
      );

      await TestBed.configureTestingModule({
        imports: [MisReservas],
      }).compileComponents();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should list the saved reservations', async () => {
      const fixture = TestBed.createComponent(MisReservas);

      await fixture.whenStable();
      fixture.detectChanges();

      const texto = (fixture.nativeElement as HTMLElement).textContent;

      expect(texto).toContain('Casa Prueba');
      expect(texto).toContain('Yopal');
      expect(texto).toContain('2 noches');
      expect(texto).toContain('CONFIRMADA');
      expect(texto).not.toContain('No tienes reservas todavía');
    });
  });
});
