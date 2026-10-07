import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Alojamiento } from '../../models/alojamiento';
import { DetalleAlojamiento } from './detalle-alojamiento';

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
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
  };
}

describe('DetalleAlojamiento', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'alojamientos/:id', component: DetalleAlojamiento }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
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

  it('should show a loading indicator while the lodging loads', async () => {
    await abrir('1');

    expect(harness.routeNativeElement?.querySelector('.spinner-border')).not.toBeNull();
  });

  it('should show the general data of the lodging of the route', async () => {
    await abrir('2');
    cargar([crearAlojamiento(1), crearAlojamiento(2)]);

    expect(texto()).toContain('Alojamiento 2');
    expect(texto()).toContain('Descripcion 2');
    expect(texto()).toContain('Chapinero, Bogotá');
    expect(texto()).toContain('Apartamento');
    expect(texto()).not.toContain('Alojamiento 1');
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
});
