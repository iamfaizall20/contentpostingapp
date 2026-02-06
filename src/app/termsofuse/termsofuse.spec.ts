import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Termsofuse } from './termsofuse';

describe('Termsofuse', () => {
  let component: Termsofuse;
  let fixture: ComponentFixture<Termsofuse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Termsofuse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Termsofuse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
