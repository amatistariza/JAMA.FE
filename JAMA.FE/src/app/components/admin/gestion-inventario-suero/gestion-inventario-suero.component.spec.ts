import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInventarioSueroComponent } from './gestion-inventario-suero.component';

describe('GestionInventarioSueroComponent', () => {
  let component: GestionInventarioSueroComponent;
  let fixture: ComponentFixture<GestionInventarioSueroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionInventarioSueroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInventarioSueroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
