import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmProcessesComponent } from './adm-processes.component';

describe('AdmProcessesComponent', () => {
  let component: AdmProcessesComponent;
  let fixture: ComponentFixture<AdmProcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmProcessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
