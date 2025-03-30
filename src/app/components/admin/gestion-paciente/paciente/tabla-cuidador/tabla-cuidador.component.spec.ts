import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCuidadorComponent } from './tabla-cuidador.component';

describe('TablaCuidadorComponent', () => {
  let component: TablaCuidadorComponent;
  let fixture: ComponentFixture<TablaCuidadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaCuidadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCuidadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
