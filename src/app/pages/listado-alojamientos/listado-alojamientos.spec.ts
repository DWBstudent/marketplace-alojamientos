import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ListadoAlojamientos } from './listado-alojamientos';

describe('ListadoAlojamientos', () => {
  let component: ListadoAlojamientos;
  let fixture: ComponentFixture<ListadoAlojamientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAlojamientos]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListadoAlojamientos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
