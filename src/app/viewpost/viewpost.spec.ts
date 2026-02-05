import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewpost } from './viewpost';

describe('Viewpost', () => {
  let component: Viewpost;
  let fixture: ComponentFixture<Viewpost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewpost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewpost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
