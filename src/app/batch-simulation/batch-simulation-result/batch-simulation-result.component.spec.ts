import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSimulationResultComponent } from './batch-simulation-result.component';

describe('BatchSimulationResultComponent', () => {
  let component: BatchSimulationResultComponent;
  let fixture: ComponentFixture<BatchSimulationResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSimulationResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSimulationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
