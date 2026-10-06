import { TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Footer);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the platform name, the current year and the institution', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Kuppo');
    expect(text).toContain(String(new Date().getFullYear()));
    expect(text).toContain('Universidad El Bosque');
  });
});
