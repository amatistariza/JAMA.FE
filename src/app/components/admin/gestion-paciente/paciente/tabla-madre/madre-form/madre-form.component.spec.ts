import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadreFormComponent } from './madre-form.component';

describe('MadreFormComponent', () => {
  let component: MadreFormComponent;
  let fixture: ComponentFixture<MadreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MadreFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
