import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMadreComponent } from './tabla-madre.component';

describe('TablaMadreComponent', () => {
  let component: TablaMadreComponent;
  let fixture: ComponentFixture<TablaMadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaMadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaMadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
