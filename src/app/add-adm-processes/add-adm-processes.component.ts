import { Component, OnInit } from '@angular/core';
import { AdmProcessService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_services';

@Component({
  selector: 'app-add-adm-processes',
  templateUrl: './add-adm-processes.component.html',
  styleUrls: ['./add-adm-processes.component.css']
})
export class AddAdmProcessesComponent implements OnInit {
  addProcessForm: FormGroup;
  submitted = false;
  paramAdmProcessBody: any;

  constructor(public service: AdmProcessService, private alertService: AlertService, private formBuilder: FormBuilder) {
    Window["myComponent"] = this;
  }

  ngOnInit() {
    this.addProcessForm = this.formBuilder.group({
      processName: ['', Validators.required],
      processCost: ['', Validators.required]
    });
  }

  get f() { return this.addProcessForm.controls; }

  /** Add processes */
  onSubmit() {
    this.submitted = true;

    if (this.addProcessForm.invalid) {
      return;
    }

    let data = {
      processName: this.f.processName.value,
      processCost: this.f.processCost.value
    }
    this.service.addAdmProcesses(data)
      .subscribe(result => {
        if (result.error) {
          alert(result.message);
        }
        else {
          alert("Successfully added");
          this.onReset();
        }
      },
        err => console.log(err)
      );
  }

  onReset() {
    this.submitted = false;
    this.addProcessForm.reset();
  }

}