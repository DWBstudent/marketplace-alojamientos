import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEstancia } from '../../models/estancia';
import { FormularioCotizacion } from './formulario-cotizacion';

describe('FormularioCotizacion', () => {
  let fixture: ComponentFixture<FormularioCotizacion>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCotizacion],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioCotizacion);
    fixture.componentRef.setInput('capacidad', 3);
    fixture.componentRef.setInput('hoy', '2026-11-01');
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  function escribir(id: string, valor: string): void {
    const campo = element.querySelector(`#${id}`) as HTMLInputElement;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
  }

  function pulsar(etiqueta: string): void {
    (element.querySelector(`button[aria-label="${etiqueta}"]`) as HTMLButtonElement).click();
  }

  function valorHuespedes(): string {
    return (element.querySelector('#huespedes') as HTMLInputElement).value;
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the maximum number of guests', () => {
    expect(element.textContent).toContain('Máximo 3 huéspedes');
  });

  it('should not offer dates before today', () => {
    expect((element.querySelector('#fecha-llegada') as HTMLInputElement).min).toBe('2026-11-01');
  });

  it('should emit the data of the stay when the form is submitted', () => {
    const emitidos: DatosEstancia[] = [];
    fixture.componentInstance.cotizar.subscribe((datos) => emitidos.push(datos));

    escribir('fecha-llegada', '2026-11-10');
    escribir('fecha-salida', '2026-11-12');
    escribir('huespedes', '2');
    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    expect(emitidos).toEqual([
      { fechaLlegada: '2026-11-10', fechaSalida: '2026-11-12', huespedes: 2 },
    ]);
  });

  it('should keep the guests between 1 and the capacity with the buttons', async () => {
    pulsar('Más huéspedes');
    await fixture.whenStable();
    expect(valorHuespedes()).toBe('1');

    for (let i = 0; i < 5; i++) pulsar('Más huéspedes');
    await fixture.whenStable();
    expect(valorHuespedes()).toBe('3');

    for (let i = 0; i < 5; i++) pulsar('Menos huéspedes');
    await fixture.whenStable();
    expect(valorHuespedes()).toBe('1');
  });

  it('should show the validation messages under each field', async () => {
    fixture.componentRef.setInput('errores', {
      fechaSalida: 'La fecha de salida debe ser posterior a la de llegada.',
      huespedes: 'Los huéspedes no pueden superar la capacidad.',
    });
    await fixture.whenStable();

    expect(element.textContent).toContain('La fecha de salida debe ser posterior a la de llegada.');
    expect(element.textContent).toContain('Los huéspedes no pueden superar la capacidad.');
  });
});
