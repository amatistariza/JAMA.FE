import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SueroFormComponent } from './suero-form.component';

describe('SueroFormComponent', () => {
  let component: SueroFormComponent;
  let fixture: ComponentFixture<SueroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SueroFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SueroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
