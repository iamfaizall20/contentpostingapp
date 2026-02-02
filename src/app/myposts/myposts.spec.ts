import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myposts } from './myposts';

describe('Myposts', () => {
  let component: Myposts;
  let fixture: ComponentFixture<Myposts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myposts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myposts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
