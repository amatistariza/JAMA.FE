import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesDetalladosComponent } from '../reportes-detallados/reportes-detallados.component';

describe('ReportesDetalladosComponent', () => {
  let component: ReportesDetalladosComponent;
  let fixture: ComponentFixture<ReportesDetalladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesDetalladosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesDetalladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
