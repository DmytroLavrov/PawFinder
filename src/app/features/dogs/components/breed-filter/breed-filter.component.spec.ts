import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedFilterComponent } from './breed-filter.component';

describe('BreedFilterComponent', () => {
  let component: BreedFilterComponent;
  let fixture: ComponentFixture<BreedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
