import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeringaFormComponent } from './jeringa-form.component';

describe('JeringaFormComponent', () => {
  let component: JeringaFormComponent;
  let fixture: ComponentFixture<JeringaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JeringaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeringaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
