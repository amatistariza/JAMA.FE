import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiluyenteFormComponent } from './diluyente-form.component';

describe('DiluyenteFormComponent', () => {
  let component: DiluyenteFormComponent;
  let fixture: ComponentFixture<DiluyenteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiluyenteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiluyenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
