import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Navbar } from './navbar';

describe('Navbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Navbar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the three main links', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a.nav-pill-link'),
    ).map((link) => link.textContent?.trim());
    expect(links).toEqual(['Inicio', 'Alojamientos', 'Mis reservas']);
  });

  it('should toggle the mobile menu', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const toggler = element.querySelector('button.navbar-toggler') as HTMLButtonElement;
    const menu = element.querySelector('#menu-principal') as HTMLElement;

    expect(menu.classList.contains('show')).toBe(false);
    toggler.click();
    await fixture.whenStable();
    expect(menu.classList.contains('show')).toBe(true);
    toggler.click();
    await fixture.whenStable();
    expect(menu.classList.contains('show')).toBe(false);
  });
});
