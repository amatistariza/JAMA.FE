import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaEnfermeraComponent } from './alerta-enfermera.component';

describe('AlertaEnfermeraComponent', () => {
  let component: AlertaEnfermeraComponent;
  let fixture: ComponentFixture<AlertaEnfermeraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertaEnfermeraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaEnfermeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
