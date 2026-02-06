import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Privacypolicy } from './privacypolicy';

describe('Privacypolicy', () => {
  let component: Privacypolicy;
  let fixture: ComponentFixture<Privacypolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Privacypolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Privacypolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
