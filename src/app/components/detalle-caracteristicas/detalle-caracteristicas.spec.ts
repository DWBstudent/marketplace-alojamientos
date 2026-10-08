import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alojamiento } from '../../models/alojamiento';
import { DetalleCaracteristicas } from './detalle-caracteristicas';

registerLocaleData(localeEsCo);

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
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
    ...cambios,
  };
}

describe('DetalleCaracteristicas', () => {
  let fixture: ComponentFixture<DetalleCaracteristicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCaracteristicas],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleCaracteristicas);
  });

  async function mostrar(alojamiento: Alojamiento): Promise<string> {
    fixture.componentRef.setInput('alojamiento', alojamiento);
    await fixture.whenStable();

    return (fixture.nativeElement as HTMLElement).textContent?.replace(/\s+/g, ' ') ?? '';
  }

  it('should create', async () => {
    await mostrar(crearAlojamiento());

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show capacity, rooms, beds and bathrooms', async () => {
    const texto = await mostrar(crearAlojamiento());

    expect(texto).toContain('4 huéspedes');
    expect(texto).toContain('2 habitaciones');
    expect(texto).toContain('3 camas');
    expect(texto).toContain('2 baños');
  });

  it('should use the singular when the amount is one', async () => {
    const texto = await mostrar(
      crearAlojamiento({ capacidad: 1, habitaciones: 1, camas: 1, banos: 1 }),
    );

    expect(texto).toContain('1 huésped');
    expect(texto).toContain('1 habitación');
    expect(texto).toContain('1 cama');
    expect(texto).toContain('1 baño');
    expect(texto).not.toContain('huéspedes');
  });

  it('should show the price per night formatted for Colombia', async () => {
    const texto = await mostrar(crearAlojamiento({ precioNoche: 1250000 }));

    expect(texto).toContain('$1.250.000');
    expect(texto).toContain('/ noche');
  });
});
