import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Alojamiento } from '../models/alojamiento';
import { Resena } from '../models/resena';
import { AlojamientoService } from './alojamiento.service';

function crearAlojamiento(id: number, activo: boolean): Alojamiento {
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
    calificacion: 4.5,
    activo,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
  };
}

function crearResena(id: number, alojamientoId: number, usuario: string): Resena {
  return {
    id,
    alojamientoId,
    usuario,
    calificacion: 5,
    comentario: 'Excelente alojamiento.',
  };
}

describe('AlojamientoService', () => {
  let service: AlojamientoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AlojamientoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return only active lodgings', () => {
    let resultado: Alojamiento[] = [];

    service.getAlojamientos().subscribe((alojamientos) => (resultado = alojamientos));

    http.expectOne('data/marketplace-data.json').flush({
      alojamientos: [crearAlojamiento(1, true), crearAlojamiento(2, false)],
      resenas: [],
    });

    expect(resultado.map((alojamiento) => alojamiento.id)).toEqual([1]);
  });

  it('should return a lodging by id', () => {
    let resultado: Alojamiento | undefined;

    service.getAlojamientoPorId(2).subscribe((alojamiento) => (resultado = alojamiento));

    http.expectOne('data/marketplace-data.json').flush({
      alojamientos: [crearAlojamiento(1, true), crearAlojamiento(2, true)],
      resenas: [],
    });

    expect(resultado?.id).toBe(2);
  });

  it('should not return an inactive lodging by id', () => {
    let resultado: Alojamiento | undefined;

    service.getAlojamientoPorId(2).subscribe((alojamiento) => (resultado = alojamiento));

    http.expectOne('data/marketplace-data.json').flush({
      alojamientos: [crearAlojamiento(1, true), crearAlojamiento(2, false)],
      resenas: [],
    });

    expect(resultado).toBeUndefined();
  });
  it('should set an error when loading a lodging by id fails', () => {
    let resultado: Alojamiento | undefined;

    service.getAlojamientoPorId(1).subscribe((alojamiento) => (resultado = alojamiento));

    http.expectOne('data/marketplace-data.json').flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(resultado).toBeUndefined();
    expect(service.mensajeError()).toBe('No fue posible cargar el alojamiento.');
    expect(service.estaCargando()).toBe(false);
  });

  it('should set an error when loading reviews fails', () => {
    let resultado: Resena[] | undefined;

    service.getResenasPorAlojamientoId(1).subscribe((resenas) => (resultado = resenas));

    http.expectOne('data/marketplace-data.json').flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(resultado).toEqual([]);
    expect(service.mensajeError()).toBe('No fue posible cargar las reseñas.');
    expect(service.estaCargando()).toBe(false);
  }); 
  it('should return reviews for a lodging', () => {
    let resultado: Resena[] = [];

    service.getResenasPorAlojamientoId(1).subscribe((resenas) => (resultado = resenas));

    http.expectOne('data/marketplace-data.json').flush({
      alojamientos: [],
      resenas: [
        crearResena(1, 1, 'Laura'),
        crearResena(2, 1, 'Carlos'),
        crearResena(3, 2, 'Andrea'),
      ],
    });

    expect(resultado.map((resena) => resena.id)).toEqual([1, 2]);
  });

  it('should set loading state while requesting lodgings', () => {
    expect(service.estaCargando()).toBe(false);

    service.getAlojamientos().subscribe();

    expect(service.estaCargando()).toBe(true);

    http.expectOne('data/marketplace-data.json').flush({
      alojamientos: [],
      resenas: [],
    });

    expect(service.estaCargando()).toBe(false);
  });

  it('should keep loading while concurrent requests are pending', () => {
    service.getAlojamientos().subscribe();
    service.getAlojamientos().subscribe();

    expect(service.estaCargando()).toBe(true);

    const requests = http.match('data/marketplace-data.json');

    expect(requests).toHaveLength(2);

    requests[0].flush({
      alojamientos: [],
      resenas: [],
    });

    expect(service.estaCargando()).toBe(true);

    requests[1].flush({
      alojamientos: [],
      resenas: [],
    });

    expect(service.estaCargando()).toBe(false);
  });

  it('should set an error when loading lodgings fails', () => {
    let resultado: Alojamiento[] = [];

    service.getAlojamientos().subscribe((alojamientos) => (resultado = alojamientos));

    const request = http.expectOne('data/marketplace-data.json');

    request.flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(resultado).toEqual([]);

    expect(service.mensajeError()).toBe('No pudimos cargar los alojamientos. Intenta de nuevo.');

    expect(service.estaCargando()).toBe(false);
  });

  it('should clear the previous error when a new request starts', () => {
    service.getAlojamientos().subscribe();

    const firstRequest = http.expectOne('data/marketplace-data.json');

    firstRequest.flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(service.mensajeError()).toBe('No pudimos cargar los alojamientos. Intenta de nuevo.');

    service.getAlojamientos().subscribe();

    expect(service.mensajeError()).toBeNull();
    expect(service.estaCargando()).toBe(true);

    http.expectOne('data/marketplace-data.json').flush({
      alojamientos: [],
      resenas: [],
    });

    expect(service.estaCargando()).toBe(false);
  });
});
