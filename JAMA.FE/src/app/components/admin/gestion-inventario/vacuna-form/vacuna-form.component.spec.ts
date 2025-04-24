import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunaFormComponent } from './vacuna-form.component';

describe('VacunaFormComponent', () => {
  let component: VacunaFormComponent;
  let fixture: ComponentFixture<VacunaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VacunaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacunaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
