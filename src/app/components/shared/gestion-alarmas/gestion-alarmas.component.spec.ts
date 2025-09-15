import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlarmasComponent } from './gestion-alarmas.component';

describe('GestionAlarmasComponent', () => {
  let component: GestionAlarmasComponent;
  let fixture: ComponentFixture<GestionAlarmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionAlarmasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAlarmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
