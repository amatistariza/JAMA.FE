import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEnfermeraComponent } from './navbar-enfermera.component';

describe('NavbarEnfermeraComponent', () => {
  let component: NavbarEnfermeraComponent;
  let fixture: ComponentFixture<NavbarEnfermeraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarEnfermeraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarEnfermeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
