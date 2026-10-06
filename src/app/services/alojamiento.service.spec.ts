import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Alojamiento } from '../models/alojamiento';
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
});
