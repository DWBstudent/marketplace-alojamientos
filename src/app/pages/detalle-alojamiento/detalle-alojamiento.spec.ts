import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Alojamiento } from '../../models/alojamiento';
import { DetalleAlojamiento } from './detalle-alojamiento';
import { ReservaService } from '../../services/reserva.service';

import { CreacionReservaService } from '../../services/creacion-reserva.service';

registerLocaleData(localeEsCo);

function crearAlojamiento(id: number, activo = true): Alojamiento {
  return {
    id,
    nombre: `Alojamiento ${id}`,
    descripcion: `Descripcion ${id}`,
    ciudad: 'Bogotá',
    ubicacion: 'Chapinero, Bogotá',
    tipo: 'Apartamento',
    capacidad: 4,
    habitaciones: 2,
    camas: 2,
    banos: 1,
    precioNoche: 100000,
    tarifaLimpieza: 20000,
    calificacion: 4.5,
    activo,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: [
      'assets/images/prueba-1.jpg',
      'assets/images/prueba-2.jpg',
      'assets/images/prueba-3.jpg',
    ],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
  };
}

describe('DetalleAlojamiento', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'alojamientos/:id',
            component: DetalleAlojamiento,
          },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  async function abrir(id: string): Promise<void> {
    await harness.navigateByUrl(`/alojamientos/${id}`);
    harness.detectChanges();
  }

  function cargar(alojamientos: Alojamiento[]): void {
    http.expectOne('data/marketplace-data.json').flush({ alojamientos, resenas: [] });

    harness.detectChanges();
  }

  function texto(): string {
    return harness.routeNativeElement?.textContent ?? '';
  }

  function escribirCampo(id: string, valor: string): void {
    const campo = harness.routeNativeElement?.querySelector(`#${id}`) as HTMLInputElement;

    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    harness.detectChanges();
  }

  function enviarCotizacion(): void {
    const formulario = harness.routeNativeElement?.querySelector('form') as HTMLFormElement;

    formulario.dispatchEvent(new Event('submit'));
    harness.detectChanges();
  }

  function cotizarEstanciaValida(): void {
    escribirCampo('fecha-llegada', '2099-11-10');
    escribirCampo('fecha-salida', '2099-11-12');
    escribirCampo('huespedes', '2');
    enviarCotizacion();
  }

  function botonReservar(): HTMLButtonElement {
    return harness.routeNativeElement?.querySelector(
      'app-formulario-huesped button[type="submit"]',
    ) as HTMLButtonElement;
  }

  function reservarComo(nombre: string, correo: string): void {
    escribirCampo('huesped-nombre', nombre);
    escribirCampo('huesped-correo', correo);

    const formulario = harness.routeNativeElement?.querySelector(
      'app-formulario-huesped form',
    ) as HTMLFormElement;

    formulario.dispatchEvent(new Event('submit'));
    harness.detectChanges();
  }

  it('should show the city and the location of the lodging', async () => {
    await abrir('1');
    cargar([{ ...crearAlojamiento(1), ciudad: 'Cartagena', ubicacion: 'Bocagrande' }]);

    expect(texto()).toContain('Cartagena');
    expect(texto()).toContain('Bocagrande');
  });

  it('should show a loading indicator while the lodging loads', async () => {
    await abrir('1');

    expect(harness.routeNativeElement?.querySelector('.spinner-border')).not.toBeNull();
  });

  it('should show the general data of the lodging of the route', async () => {
    await abrir('2');

    expect(router.url).toBe('/alojamientos/2');

    cargar([crearAlojamiento(1), crearAlojamiento(2)]);

    expect(texto()).toContain('Alojamiento 2');
    expect(texto()).toContain('Descripcion 2');
    expect(texto()).toContain('Chapinero, Bogotá');
    expect(texto()).toContain('Apartamento');
    expect(texto()).not.toContain('Alojamiento 1');
  });

  it('should show all lodging gallery images', async () => {
    await abrir('2');
    cargar([crearAlojamiento(1), crearAlojamiento(2)]);

    const imagenes = harness.routeNativeElement?.querySelectorAll('img');

    expect(imagenes?.length).toBe(3);
    expect(imagenes?.[0].getAttribute('src')).toBe('assets/images/prueba-1.jpg');
    expect(imagenes?.[1].getAttribute('src')).toBe('assets/images/prueba-2.jpg');
    expect(imagenes?.[2].getAttribute('src')).toBe('assets/images/prueba-3.jpg');
  });

  it('should link back to the list', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    const enlace = harness.routeNativeElement?.querySelector('a[href$="/alojamientos"]');

    expect(enlace).not.toBeNull();
  });

  it('should say that an inactive lodging is not available', async () => {
    await abrir('2');
    cargar([crearAlojamiento(1), crearAlojamiento(2, false)]);

    expect(texto()).toContain('Alojamiento no disponible');
    expect(texto()).not.toContain('Descripcion 2');
  });

  it('should say that an unknown lodging is not available', async () => {
    await abrir('99');
    cargar([crearAlojamiento(1)]);

    expect(texto()).toContain('Alojamiento no disponible');
  });

  it('should show an error message when the lodging cannot be loaded', async () => {
    await abrir('1');

    http.expectOne('data/marketplace-data.json').flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });

    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('.alert-danger')?.textContent).toContain(
      'No fue posible cargar el alojamiento.',
    );
  });

  it('should reserve a column for the quotation', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    expect(harness.routeNativeElement?.querySelector('aside')).not.toBeNull();
  });

  it('should show the quotation form for the lodging capacity', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    expect(texto()).toContain('Cotiza tu estancia');
    expect(texto()).toContain('Máximo 4 huéspedes');
  });

  it('should show the complete quotation after valid data is submitted', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    escribirCampo('fecha-llegada', '2099-11-10');
    escribirCampo('fecha-salida', '2099-11-12');
    escribirCampo('huespedes', '2');

    enviarCotizacion();

    expect(texto()).toContain('Resumen de cotización');
    expect(texto()).toContain('Noches');
    expect(texto()).toContain('2');
    expect(texto()).toContain('Subtotal');
    expect(texto()).toContain('200,000');
    expect(texto()).toContain('Tarifa de limpieza');
    expect(texto()).toContain('20,000');
    expect(texto()).toContain('Tarifa de servicio (10%)');
    expect(texto()).toContain('20,000');
    expect(texto()).toContain('Total');
    expect(texto()).toContain('240,000');
  });

  it('should show validation errors and not show a quotation when the dates are invalid', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    escribirCampo('fecha-llegada', '2099-11-10');
    escribirCampo('fecha-salida', '2099-11-10');
    escribirCampo('huespedes', '2');

    enviarCotizacion();

    expect(texto()).toContain('La fecha de salida debe ser posterior a la de llegada.');
    expect(texto()).not.toContain('Resumen de cotización');
  });

  it('should show a validation error when the number of guests exceeds capacity', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    escribirCampo('fecha-llegada', '2099-11-10');
    escribirCampo('fecha-salida', '2099-11-12');
    escribirCampo('huespedes', '5');

    enviarCotizacion();

    expect(texto()).toContain('Máximo 4 huéspedes para este alojamiento.');
    expect(texto()).not.toContain('Resumen de cotización');
  });

  it('should clear a previous quotation when a later validation fails', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    escribirCampo('fecha-llegada', '2099-11-10');
    escribirCampo('fecha-salida', '2099-11-12');
    escribirCampo('huespedes', '2');

    enviarCotizacion();

    expect(texto()).toContain('Resumen de cotización');
    expect(texto()).toContain('240,000');

    escribirCampo('fecha-salida', '2099-11-10');

    enviarCotizacion();

    expect(texto()).toContain('La fecha de salida debe ser posterior a la de llegada.');
    expect(texto()).not.toContain('Resumen de cotización');
    expect(texto()).not.toContain('240,000');
  });

  it('should keep the reserve button disabled until there is a valid quotation', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    expect(texto()).toContain('Datos del huésped');
    expect(botonReservar().disabled).toBe(true);

    cotizarEstanciaValida();

    expect(botonReservar().disabled).toBe(false);
  });

  it('should drop the quotation and disable the reserve button when the stay is edited', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);

    cotizarEstanciaValida();

    expect(texto()).toContain('Resumen de cotización');

    escribirCampo('fecha-salida', '2099-11-13');

    expect(texto()).not.toContain('Resumen de cotización');
    expect(botonReservar().disabled).toBe(true);
  });

  it('should create a confirmed reservation from the quoted stay and open "Mis reservas"', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);
    const navegar = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    cotizarEstanciaValida();
    reservarComo('Laura Gómez', 'laura@example.com');

    const reservas = TestBed.inject(ReservaService).reservas();

    expect(reservas).toHaveLength(1);
    expect(reservas[0]).toMatchObject({
      alojamientoId: 1,
      alojamientoNombre: 'Alojamiento 1',
      ciudad: 'Bogotá',
      fechaLlegada: '2099-11-10',
      fechaSalida: '2099-11-12',
      huespedes: 2,
      noches: 2,
      total: 240000,
      estado: 'CONFIRMADA',
      nombreHuesped: 'Laura Gómez',
      correoHuesped: 'laura@example.com',
    });
    expect(navegar).toHaveBeenCalledWith('/mis-reservas');
  });

  it('should not create a reservation when the guest data is invalid', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);
    const navegar = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    cotizarEstanciaValida();
    reservarComo('', 'no-es-un-correo');

    expect(TestBed.inject(ReservaService).reservas()).toHaveLength(0);
    expect(navegar).not.toHaveBeenCalled();
    expect(texto()).toContain('El nombre del huésped es obligatorio.');
  });

  it('should show an error and stay on the page when the reservation cannot be saved', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);
    const navegar = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage full');
    });

    cotizarEstanciaValida();
    reservarComo('Laura Gómez', 'laura@example.com');

    expect(texto()).toContain('No se pudo guardar la reserva en este dispositivo.');
    expect(navegar).not.toHaveBeenCalled();
  });

  it('should reserve through CreacionReservaService with the quoted stay', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const reservar = vi.spyOn(TestBed.inject(CreacionReservaService), 'reservar');

    cotizarEstanciaValida();
    reservarComo('Laura Gómez', 'laura@example.com');

    expect(reservar).toHaveBeenCalledTimes(1);

    const [alojamiento, estancia, cotizacion, huesped] = reservar.mock.calls[0];

    expect(alojamiento.id).toBe(1);
    expect(estancia).toEqual({
      fechaLlegada: '2099-11-10',
      fechaSalida: '2099-11-12',
      huespedes: 2,
    });
    expect(cotizacion?.total).toBe(240000);
    expect(huesped).toEqual({ nombreHuesped: 'Laura Gómez', correoHuesped: 'laura@example.com' });
  });

  it('should show the reason and stay on the page when the reservation is rejected', async () => {
    await abrir('1');
    cargar([crearAlojamiento(1)]);
    const navegar = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.spyOn(TestBed.inject(CreacionReservaService), 'reservar').mockReturnValue({
      reserva: null,
      error: 'Este alojamiento ya no está disponible.',
    });

    cotizarEstanciaValida();
    reservarComo('Laura Gómez', 'laura@example.com');

    expect(texto()).toContain('Este alojamiento ya no está disponible.');
    expect(navegar).not.toHaveBeenCalled();
  });
});
