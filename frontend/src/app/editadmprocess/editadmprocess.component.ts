import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmProcessService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-adm-processes',
  templateUrl: './editadmprocess.component.html',
  // styleUrls: ['./add-adm-processes.component.css']
})
export class EditadmprocessComponent implements OnInit {
  editProcessForm: FormGroup;
  submitted = false;
  paramAdmProcessBody: any;
  processId: any;
  processName: any;
  processCost: any;

  constructor(
    public apiService: AdmProcessService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    Window["myComponent"] = this;
  }

  getAdmProcessById(processId) {
    this.apiService.getAdmProcessById({ 'id': processId })
      .subscribe(data => {
        this.processName = data['result'][0].Name;
        this.processCost = data['result'][0].Cost;
      },
        err => console.log(err)
      );
  }

  ngOnInit() {
    this.processId = this.route.snapshot.params.id;
    this.getAdmProcessById(this.processId);

    this.editProcessForm = this.formBuilder.group({
      processName: ['', Validators.required],
      processCost: ['', Validators.required]
    });
  }

  get f() { return this.editProcessForm.controls; }

  /** Add processes */
  onSubmit() {
    this.submitted = true;

    if (this.editProcessForm.invalid) {
      return;
    }

    let data = {
      processId: this.processId,
      processName: this.f.processName.value,
      processCost: this.f.processCost.value
    }
    this.apiService.editAdmProcesses(data)
      .subscribe(result => {
        if (result.error) {
          alert(result.message);
        }
        else {
          alert("Successfully updated");
          this.onReset();
          this.router.navigate(['/admProcesses'])
        }
      },
        err => console.log(err)
      );
  }

  onReset() {
    this.submitted = false;
    this.editProcessForm.reset();
  }

}