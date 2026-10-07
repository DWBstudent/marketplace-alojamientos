import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resena } from '../../models/resena';
import { ResenasAlojamiento } from './resenas-alojamiento';

function crearResena(id: number, usuario: string): Resena {
  return {
    id,
    alojamientoId: 1,
    usuario,
    calificacion: 5,
    comentario: `Comentario de ${usuario}`,
  };
}

describe('ResenasAlojamiento', () => {
  let fixture: ComponentFixture<ResenasAlojamiento>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResenasAlojamiento],
    }).compileComponents();

    fixture = TestBed.createComponent(ResenasAlojamiento);
    element = fixture.nativeElement as HTMLElement;
  });

  async function mostrar(calificacion: number, resenas: Resena[]): Promise<void> {
    fixture.componentRef.setInput('calificacion', calificacion);
    fixture.componentRef.setInput('resenas', resenas);
    await fixture.whenStable();
  }

  it('should create', async () => {
    await mostrar(4.5, []);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the rating and the number of reviews', async () => {
    await mostrar(4.5, [crearResena(1, 'Laura'), crearResena(2, 'Carlos')]);

    expect(element.querySelector('.resenas-resumen')?.textContent).toContain('4.5');
    expect(element.querySelector('.resenas-resumen')?.textContent).toContain('2 reseña(s)');
  });

  it('should list every review with its author', async () => {
    await mostrar(4.5, [crearResena(1, 'Laura'), crearResena(2, 'Carlos')]);

    const autores = Array.from(element.querySelectorAll('.resena strong')).map((e) =>
      e.textContent?.trim(),
    );

    expect(autores).toEqual(['Laura', 'Carlos']);
  });

  it('should show a message when there are no reviews', async () => {
    await mostrar(0, []);

    expect(element.querySelector('.resenas-vacio')).not.toBeNull();
    expect(element.querySelectorAll('.resena').length).toBe(0);
  });
});
