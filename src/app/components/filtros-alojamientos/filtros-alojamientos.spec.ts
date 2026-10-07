import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FILTRO_VACIO } from '../../models/filtro-busqueda';
import { FiltrosAlojamientos } from './filtros-alojamientos';

describe('FiltrosAlojamientos', () => {
  let fixture: ComponentFixture<FiltrosAlojamientos>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosAlojamientos],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosAlojamientos);
    fixture.componentRef.setInput('ciudades', ['Bogotá', 'Cartagena']);
    fixture.componentRef.setInput('tipos', ['Apartamento', 'Casa']);
    fixture.componentRef.setInput('filtro', FILTRO_VACIO);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  function elegir(idSelect: string, valor: string): void {
    const select = element.querySelector(`#${idSelect}`) as HTMLSelectElement;
    select.value = valor;
    select.dispatchEvent(new Event('change'));
  }

  function textos(selector: string): (string | undefined)[] {
    return Array.from(element.querySelectorAll(selector)).map((opcion) =>
      opcion.textContent?.trim(),
    );
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should list "Todas" and the cities', () => {
    expect(textos('#filtro-ciudad option')).toEqual(['Todas', 'Bogotá', 'Cartagena']);
  });

  it('should list "Todos" and the types', () => {
    expect(textos('#filtro-tipo option')).toEqual(['Todos', 'Apartamento', 'Casa']);
  });

  it('should update the city of the filter', () => {
    elegir('filtro-ciudad', 'Cartagena');

    expect(fixture.componentInstance.filtro().ciudad).toBe('Cartagena');
  });

  it('should clear the city when "Todas" is chosen', () => {
    elegir('filtro-ciudad', 'Cartagena');
    elegir('filtro-ciudad', '');

    expect(fixture.componentInstance.filtro().ciudad).toBeNull();
  });

  it('should update the type and keep the other criteria', () => {
    elegir('filtro-ciudad', 'Bogotá');
    elegir('filtro-tipo', 'Casa');

    expect(fixture.componentInstance.filtro()).toEqual({
      ...FILTRO_VACIO,
      ciudad: 'Bogotá',
      tipo: 'Casa',
    });
  });
  it('should reset the filter when clearing filters', () => {
    elegir('filtro-ciudad', 'Cartagena');
    elegir('filtro-tipo', 'Casa');

    (element.querySelector('button') as HTMLButtonElement).click();

    expect(fixture.componentInstance.filtro()).toEqual(FILTRO_VACIO);
  });
});
