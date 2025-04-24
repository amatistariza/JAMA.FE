import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInventarioJeringaComponent } from './gestion-inventario-jeringa.component';

describe('GestionInventarioJeringaComponent', () => {
  let component: GestionInventarioJeringaComponent;
  let fixture: ComponentFixture<GestionInventarioJeringaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionInventarioJeringaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInventarioJeringaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
