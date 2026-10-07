import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosHuesped } from '../../models/huesped';
import { FormularioHuesped } from './formulario-huesped';

describe('FormularioHuesped', () => {
  let fixture: ComponentFixture<FormularioHuesped>;
  let element: HTMLElement;
  let emitidos: DatosHuesped[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioHuesped],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioHuesped);
    fixture.componentRef.setInput('habilitado', true);
    emitidos = [];
    fixture.componentInstance.reservar.subscribe((datos) => emitidos.push(datos));
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  function escribir(id: string, valor: string): void {
    const campo = element.querySelector(`#${id}`) as HTMLInputElement;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
  }

  async function enviar(): Promise<void> {
    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  function boton(): HTMLButtonElement {
    return element.querySelector('button[type="submit"]') as HTMLButtonElement;
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should enable the reserve button when there is a valid quotation', () => {
    expect(boton().disabled).toBe(false);
  });

  it('should disable the button and explain why when there is no valid quotation', async () => {
    fixture.componentRef.setInput('habilitado', false);
    await fixture.whenStable();

    expect(boton().disabled).toBe(true);
    expect(element.textContent).toContain('Primero genera una cotización válida');
  });

  it('should ask for the name and the email when the form is empty', async () => {
    await enviar();

    expect(element.textContent).toContain('El nombre del huésped es obligatorio.');
    expect(element.textContent).toContain('El correo electrónico es obligatorio.');
    expect(emitidos).toEqual([]);
  });

  it('should reject an invalid email', async () => {
    escribir('huesped-nombre', 'Laura Gómez');
    escribir('huesped-correo', 'laura@');
    await enviar();

    expect(element.textContent).toContain('Escribe un correo electrónico válido.');
    expect(emitidos).toEqual([]);
  });

  it('should emit the trimmed data when everything is valid', async () => {
    escribir('huesped-nombre', '  Laura Gómez ');
    escribir('huesped-correo', ' laura@example.com ');
    await enviar();

    expect(emitidos).toEqual([
      { nombreHuesped: 'Laura Gómez', correoHuesped: 'laura@example.com' },
    ]);
  });

  it('should not emit anything when there is no valid quotation', async () => {
    fixture.componentRef.setInput('habilitado', false);
    escribir('huesped-nombre', 'Laura Gómez');
    escribir('huesped-correo', 'laura@example.com');
    await enviar();

    expect(emitidos).toEqual([]);
  });
});
