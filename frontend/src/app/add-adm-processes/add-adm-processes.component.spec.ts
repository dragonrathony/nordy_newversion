import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdmProcessesComponent } from './add-adm-processes.component';

describe('AddAdmProcessesComponent', () => {
  let component: AddAdmProcessesComponent;
  let fixture: ComponentFixture<AddAdmProcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdmProcessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdmProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
