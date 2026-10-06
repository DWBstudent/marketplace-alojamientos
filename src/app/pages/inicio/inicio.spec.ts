import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Inicio } from './inicio';

describe('Inicio', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Inicio);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the platform name and a link to the search', async () => {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Kuppo');
    const link = element.querySelector('a.btn-kuppo') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toMatch(/\/alojamientos$/);
  });
});
