import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alojamiento } from '../../models/alojamiento';
import { AlojamientoCard } from './alojamiento-card';

registerLocaleData(localeEsCo);

const alojamiento: Alojamiento = {
  id: 1,
  nombre: 'Loft moderno en Chapinero',
  descripcion: 'Loft moderno ubicado cerca de restaurantes, cafés y zonas comerciales de Bogotá.',
  ciudad: 'Bogotá',
  ubicacion: 'Chapinero, Bogotá',
  tipo: 'Apartamento',
  capacidad: 2,
  habitaciones: 1,
  camas: 1,
  banos: 1,
  precioNoche: 180000,
  tarifaLimpieza: 45000,
  calificacion: 4.8,
  activo: true,
  imagenPrincipal: 'assets/images/loft-bogota.jpg',
  imagenes: ['assets/images/loft-bogota.jpg'],
  servicios: ['Wi-Fi', 'Cocina'],
  reglas: ['No fumar'],
};

describe('AlojamientoCard', () => {
  let fixture: ComponentFixture<AlojamientoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlojamientoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AlojamientoCard);
    fixture.componentRef.setInput('alojamiento', alojamiento);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the minimum fields of the lodging', () => {
    const elemento: HTMLElement = fixture.nativeElement;
    const texto = elemento.textContent ?? '';

    expect(elemento.querySelector('img')?.getAttribute('src')).toBe(alojamiento.imagenPrincipal);
    expect(texto).toContain('Loft moderno en Chapinero');
    expect(texto).toContain('Bogotá');
    expect(texto).toContain('Apartamento');
    expect(texto).toContain('2 huéspedes');
    expect(texto).toContain('$180.000');
    expect(texto).toContain('4,8');
    expect(texto).toContain('Wi-Fi');
    expect(texto).toContain('Cocina');
  });

  it('should show a placeholder when the image fails to load', async () => {
    const elemento: HTMLElement = fixture.nativeElement;

    elemento.querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(elemento.querySelector('img')).toBeNull();
    expect(elemento.querySelector('.alojamiento-card-sin-imagen')).not.toBeNull();
  });
});
