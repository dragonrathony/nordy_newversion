import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { QuantitySimulationService } from '../_services';
import { ModalService } from '../_services';

@Component({
  selector: 'app-quantity-simulation',
  templateUrl: './quantity-simulation.component.html',
  styleUrls: ['./quantity-simulation.component.css']
})
export class QuantitySimulationComponent implements OnInit {

  dynamicForm: FormGroup;
  submitted = false;
  numberOfTickets = false;
  isLoading = false;
  isInvalid: Boolean = false;
  simulationResultFlag: Boolean = false;
  simulationResult: any;
  tax: any;

  constructor(private formBuilder: FormBuilder, public apiService: QuantitySimulationService, public modalService: ModalService) { }

  ngOnInit() {
    this.formGroupInit();
    this.simulationResultFlag = false;
  }

  formGroupInit() {
    this.dynamicForm = this.formBuilder.group({
      productCode: ['', Validators.required],
      ICMS: ['', Validators.required],
      PIS: [1.65, Validators.required],
      COFINS: [7.6, Validators.required],
      Comission: ['', Validators.required],
      Ship: ['', Validators.required],
      Margin: ['', Validators.required],
      data: new FormArray([])
    });
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.data as FormArray; }

  onAddForm() {
    this.submitted = false;
    this.numberOfTickets = true;
    this.t.push(this.formBuilder.group({
      Quantity: ['', Validators.required],
    }));
  }

  onSubmit() {
    this.submitted = true;
    this.isInvalid = false;

    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      this.isInvalid = true;
      return;
    }
    if (!this.numberOfTickets) {
      return;
    }
    // console.log('batchSimulation clicked', this.dynamicForm.value)
    this.batchSimulation();
    
  }


  batchSimulation() {
    this.isLoading = true;
    this.apiService.quantitySimulation(this.dynamicForm.value)
      .subscribe(result => {
        if (result.message) {
          alert('error in typed parameters')
          this.isLoading = false;
        }
        else {
          console.log('Batch simulation result is', result.result)
        }
        this.simulationResult = result.result;
        this.tax = this.dynamicForm.value;
        this.simulationResultFlag = true;
        this.isLoading = false;
      },
        err => console.log(err)
      );
  }

  onReset() {
    // reset whole form back to initial state
    this.numberOfTickets = false;
    this.submitted = false;
    this.t.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.numberOfTickets = true;
    this.submitted = false;
    this.t.reset();
  }

  getUpdatedSimResultFlag($event) {
    this.simulationResultFlag = $event;
  }

}
