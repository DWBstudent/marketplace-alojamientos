import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Alojamiento, TipoAlojamiento } from '../../models/alojamiento';
import { FILTRO_VACIO } from '../../models/filtro-busqueda';
import { ListadoAlojamientos } from './listado-alojamientos';

function crearAlojamiento(
  id: number,
  ciudad: string,
  tipo: TipoAlojamiento,
  capacidad = 4,
  precioNoche = 100000,
): Alojamiento {
  return {
    id,
    nombre: `Alojamiento ${id}`,
    descripcion: 'Descripcion de prueba',
    ciudad,
    ubicacion: 'Centro',
    tipo,
    capacidad,
    habitaciones: 2,
    camas: 2,
    banos: 1,
    precioNoche,
    tarifaLimpieza: 20000,
    calificacion: 4.5,
    activo: true,
    imagenPrincipal: 'assets/images/prueba.jpg',
    imagenes: ['assets/images/prueba.jpg'],
    servicios: ['Wi-Fi'],
    reglas: ['No fumar'],
  };
}

describe('ListadoAlojamientos', () => {
  let component: ListadoAlojamientos;
  let fixture: ComponentFixture<ListadoAlojamientos>;
  let http: HttpTestingController;
  let element: HTMLElement;

  const alojamientos = [
    crearAlojamiento(1, 'Bogotá', 'Apartamento', 2, 180000),
    crearAlojamiento(2, 'Cartagena', 'Apartamento', 5, 420000),
    crearAlojamiento(3, 'Guatapé', 'Cabaña', 6, 350000),
    crearAlojamiento(4, 'Bogotá', 'Casa', 8, 300000),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAlojamientos],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ListadoAlojamientos);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  async function cargarDatos(datos = alojamientos): Promise<void> {
    http.expectOne('data/marketplace-data.json').flush({ alojamientos: datos, resenas: [] });

    await fixture.whenStable();
  }

  function cantidadMostrada(): number {
    return element.querySelectorAll('article').length;
  }

  function opciones(idSelect: string): (string | undefined)[] {
    return Array.from(element.querySelectorAll(`#${idSelect} option`)).map((opcion) =>
      opcion.textContent?.trim(),
    );
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list every lodging when there is no filter', async () => {
    await cargarDatos();

    expect(cantidadMostrada()).toBe(4);
  });

  it('should offer the cities and types found in the data', async () => {
    await cargarDatos();

    expect(opciones('filtro-ciudad')).toEqual(['Todas', 'Bogotá', 'Cartagena', 'Guatapé']);

    expect(opciones('filtro-tipo')).toEqual(['Todos', 'Apartamento', 'Cabaña', 'Casa']);
  });

  it('should show only the lodgings of the chosen city', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      ciudad: 'Bogotá',
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(2);
  });

  it('should show only the lodgings of the chosen type', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      tipo: 'Apartamento',
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(2);
  });

  it('should show only lodgings that can accommodate the selected guests', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      huespedes: 5,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(3);
  });

  it('should show only lodgings within the maximum price', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      precioMaximo: 350000,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(3);
  });

  it('should combine city and type', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      ciudad: 'Bogotá',
      tipo: 'Casa',
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should combine city and guests', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      ciudad: 'Bogotá',
      huespedes: 5,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should combine city and maximum price', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      ciudad: 'Bogotá',
      precioMaximo: 300000,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(2);
  });

  it('should combine type and guests', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      tipo: 'Apartamento',
      huespedes: 5,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should combine type and maximum price', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      tipo: 'Apartamento',
      precioMaximo: 350000,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should combine guests and maximum price', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      huespedes: 7,
      precioMaximo: 350000,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should combine all four filters', async () => {
    await cargarDatos();

    component.filtro.set({
      ciudad: 'Bogotá',
      tipo: 'Casa',
      huespedes: 6,
      precioMaximo: 300000,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should show no results when the filters do not match any lodging', async () => {
    await cargarDatos();

    component.filtro.set({
      ciudad: 'Bogotá',
      tipo: 'Cabaña',
      huespedes: 8,
      precioMaximo: 200000,
    });

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(0);
    expect(element.textContent).toContain('No encontramos alojamientos');
  });

  it('should show every lodging again when the filter is cleared', async () => {
    await cargarDatos();

    component.filtro.set({
      ...FILTRO_VACIO,
      ciudad: 'Bogotá',
    });

    await fixture.whenStable();

    component.filtro.set(FILTRO_VACIO);

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(4);
  });

  it('should filter when a city is chosen in the panel', async () => {
    await cargarDatos();

    const select = element.querySelector('#filtro-ciudad') as HTMLSelectElement;

    select.value = 'Cartagena';
    select.dispatchEvent(new Event('change'));

    await fixture.whenStable();

    expect(cantidadMostrada()).toBe(1);
  });

  it('should show an empty state when there are no lodgings', async () => {
    await cargarDatos([]);

    expect(cantidadMostrada()).toBe(0);
    expect(element.textContent).toContain('No encontramos alojamientos');
  });
});
