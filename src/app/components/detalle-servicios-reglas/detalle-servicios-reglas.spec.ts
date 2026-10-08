import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alojamiento } from '../../models/alojamiento';
import { DetalleServiciosReglas } from './detalle-servicios-reglas';

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
    camas: 3,
    banos: 2,
    precioNoche: 180000,
    tarifaLimpieza: 45000,
    calificacion: 4.5,
    activo: true,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi', 'Cocina', 'Parqueadero'],
    reglas: ['No fumar', 'No se permiten fiestas'],
    ...cambios,
  };
}

describe('DetalleServiciosReglas', () => {
  let fixture: ComponentFixture<DetalleServiciosReglas>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleServiciosReglas],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleServiciosReglas);
    element = fixture.nativeElement as HTMLElement;
  });

  async function mostrar(alojamiento: Alojamiento): Promise<void> {
    fixture.componentRef.setInput('alojamiento', alojamiento);
    await fixture.whenStable();
  }

  function textos(selector: string): (string | undefined)[] {
    return Array.from(element.querySelectorAll(selector)).map((item) => item.textContent?.trim());
  }

  it('should create', async () => {
    await mostrar(crearAlojamiento());

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should list every service of the lodging', async () => {
    await mostrar(crearAlojamiento());

    expect(textos('#titulo-servicios + ul li')).toEqual(['Wi-Fi', 'Cocina', 'Parqueadero']);
  });

  it('should list every basic rule of the lodging', async () => {
    await mostrar(crearAlojamiento());

    expect(textos('#titulo-reglas + ul li')).toEqual(['No fumar', 'No se permiten fiestas']);
  });

  it('should say so when there are no services or rules', async () => {
    await mostrar(crearAlojamiento({ servicios: [], reglas: [] }));

    expect(element.textContent).toContain('no tiene servicios registrados');
    expect(element.textContent).toContain('no tiene reglas registradas');
  });
});
