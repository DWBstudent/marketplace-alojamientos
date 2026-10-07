import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Alojamiento } from '../../models/alojamiento';
import { Inicio } from './inicio';

function crearAlojamiento(id: number, calificacion: number): Alojamiento {
  return {
    id,
    nombre: `Alojamiento ${id}`,
    descripcion: 'Descripcion de prueba',
    ciudad: 'Bogotá',
    ubicacion: 'Centro',
    tipo: 'Casa',
    capacidad: 4,
    habitaciones: 2,
    camas: 2,
    banos: 1,
    precioNoche: 100000,
    tarifaLimpieza: 20000,
    calificacion,
    activo: true,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
  };
}

describe('Inicio', () => {
  let fixture: ComponentFixture<Inicio>;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Inicio);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  async function cargar(alojamientos: Alojamiento[]): Promise<void> {
    http.expectOne('data/marketplace-data.json').flush({ alojamientos, resenas: [] });
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the platform name and a link to the search', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Kuppo');
    const enlace = element.querySelector('a.btn-kuppo') as HTMLAnchorElement;

    expect(enlace.getAttribute('href')).toMatch(/\/alojamientos$/);
  });

  it('should show a loading indicator while the lodgings load', () => {
    expect(element.querySelector('.spinner-border')).not.toBeNull();
  });

  it('should show the three best rated lodgings, highest first', async () => {
    await cargar([
      crearAlojamiento(1, 4.2),
      crearAlojamiento(2, 4.9),
      crearAlojamiento(3, 4.5),
      crearAlojamiento(4, 4.7),
    ]);

    const nombres = Array.from(element.querySelectorAll('article h2')).map((titulo) =>
      titulo.textContent?.trim(),
    );

    expect(nombres).toEqual(['Alojamiento 2', 'Alojamiento 4', 'Alojamiento 3']);
  });

  it('should show an error message when the lodgings cannot be loaded', async () => {
    http.expectOne('data/marketplace-data.json').flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });
    await fixture.whenStable();

    expect(element.querySelector('.alert-danger')?.textContent).toContain(
      'No pudimos cargar los alojamientos',
    );
  });

  it('should show a message when there are no featured lodgings', async () => {
    await cargar([]);

    expect(element.textContent).toContain('Por ahora no hay alojamientos destacados.');
  });
});
