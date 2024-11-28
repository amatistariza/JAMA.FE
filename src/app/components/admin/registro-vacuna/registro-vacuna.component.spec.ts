import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVacunaComponent } from './registro-vacuna.component';

describe('RegistroVacunaComponent', () => {
  let component: RegistroVacunaComponent;
  let fixture: ComponentFixture<RegistroVacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroVacunaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroVacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
