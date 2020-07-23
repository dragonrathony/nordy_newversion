import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSimulationComponent } from './batch-simulation.component';

describe('BatchSimulationComponent', () => {
  let component: BatchSimulationComponent;
  let fixture: ComponentFixture<BatchSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
