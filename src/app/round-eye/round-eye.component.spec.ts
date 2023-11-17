import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundEyeComponent } from './round-eye.component';

describe('RoundEyeComponent', () => {
  let component: RoundEyeComponent;
  let fixture: ComponentFixture<RoundEyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundEyeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoundEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
