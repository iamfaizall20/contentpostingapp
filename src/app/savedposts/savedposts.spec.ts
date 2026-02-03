import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Savedposts } from './savedposts';

describe('Savedposts', () => {
  let component: Savedposts;
  let fixture: ComponentFixture<Savedposts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Savedposts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Savedposts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
