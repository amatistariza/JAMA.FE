import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInventarioDiluyenteComponent } from './gestion-inventario-diluyente.component';

describe('GestionInventarioDiluyenteComponent', () => {
  let component: GestionInventarioDiluyenteComponent;
  let fixture: ComponentFixture<GestionInventarioDiluyenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionInventarioDiluyenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInventarioDiluyenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
