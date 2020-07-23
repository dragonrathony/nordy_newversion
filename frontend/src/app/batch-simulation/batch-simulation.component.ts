import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BatchSimulationService } from '../_services';
import { ModalService } from '../_services';

@Component({
  selector: 'app-batch-simulation',
  templateUrl: './batch-simulation.component.html',
  styleUrls: ['./batch-simulation.component.css']
})
export class BatchSimulationComponent implements OnInit {
  dynamicForm: FormGroup;
  submitted = false;
  numberOfTickets = false;
  isLoading = false;
  isInvalid: Boolean = false;
  simulationResultFlag: Boolean = false;
  simulationResult: any;
  tax: any;

  savedSimulNameLists = [];
  isSavedSimulation = false; toBeUpdated = false;
  simulationId = 0; simulationName = '';
  orderQuotForm: FormGroup;
  goClicked = false; orderQuotVal = 1;
  orderQuotList = [{ val: '1', name: 'Order' }, { val: '2', name: 'Quotation' }];
  dateList = [];

  constructor(private formBuilder: FormBuilder, public apiService: BatchSimulationService, public modalService: ModalService) { }

  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      data: new FormArray([])
    });
    this.orderQuotForm = this.formBuilder.group({
      orderQuot: ['', Validators.required],
      selDate: ['', Validators.required]
    })
    this.simulationResultFlag = false;
    this.getInitData();
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.data as FormArray; }

  getInitData() {
    this.isLoading = true;
    this.apiService.getInitBatchSimData(this.orderQuotVal)
      .subscribe(result => {
        this.savedSimulNameLists = result.result.savedSimData;
        this.dateList = result.result.orderQuotDate;
        this.isLoading = false;
      },
        err => console.log(err)
      )
  }

  simulationSelect(val, text) {
    this.simulationId = val;
    this.simulationName = text;
    this.isLoading = true;
    this.apiService.getSavedSimulationById(this.simulationId)
      .subscribe(result => {
        this.dynamicForm.reset();
        this.orderQuotForm.reset();
        this.t.clear();
        this.numberOfTickets = true;
        this.goClicked = false;
        result.result.forEach(element => {
          this.t.push(this.formBuilder.group({
            Orders: [element.Orders, Validators.required],
            productCode: [element.ProductCode, Validators.required],
            Quantity: [element.Quantity, Validators.required],
            ICMS: [element.ICMS, Validators.required],
            PIS: [1.65, Validators.required],
            COFINS: [7.6, Validators.required],
            Comission: [element.Comission, Validators.required],
            Ship: [element.Shipment, Validators.required],
            Margin: [element.Margin, Validators.required]
          }));
          this.isSavedSimulation = true;
          this.isLoading = false;
        });
      },
        err => console.log(err)
      )
  }

  onAddForm() {
    this.submitted = false;
    this.numberOfTickets = true;
    this.toBeUpdated = true;
    this.t.push(this.formBuilder.group({
      Orders: ['', Validators.required],
      productCode: ['', Validators.required],
      Quantity: ['', Validators.required],
      ICMS: ['', Validators.required],
      PIS: [1.65, Validators.required],
      COFINS: [7.6, Validators.required],
      Comission: ['', Validators.required],
      Ship: ['', Validators.required],
      Margin: ['', Validators.required]
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

    if (this.isSavedSimulation) {
      this.isLoading = true;
      if (this.toBeUpdated) {
        this.dynamicForm.value['Simulation'] = this.simulationId;
        this.dynamicForm.value['SimulationName'] = this.simulationName;
        this.apiService.batchSimulationUpdate(this.dynamicForm.value)
          .subscribe(result => {
            // console.log('Check the result of updating batchSimulation data', result)
            this.batchSimulation();
          },
            err => console.log(err)
          );
      } else {
        this.batchSimulation();
      }
    } else {
      let modalData = { type: "addSimulation", simulationName: '' }
      this.modalService.openDialog(modalData)
        .afterClosed().subscribe(res => {
          if (res) {
            this.dynamicForm.value['SimulationName'] = res;
            this.isLoading = true;
            this.apiService.batchSimulationSave(this.dynamicForm.value)
              .subscribe(result => {
                // console.log('Check the result of saving batchSimulation data', result)
                this.batchSimulation();
              },
                err => console.log(err)
              );
          } else {
            this.isLoading = true;
            this.batchSimulation();
          }
        })
    }
  }

  getDateList(e) {
    this.orderQuotForm.controls.selDate.reset();
    this.orderQuotVal = e.value;
    this.getInitData();
  }

  onGo() {
    this.goClicked = true;
    if (this.orderQuotForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.apiService.getSavedOrderQuot(this.orderQuotForm.value)
      .subscribe(result => {
        console.log('go result', result)
        this.dynamicForm.reset();
        this.t.clear();
        this.numberOfTickets = true;
        result.result.forEach(element => {
          this.t.push(this.formBuilder.group({
            Orders: [1, Validators.required],
            productCode: [element.ProductCode, Validators.required],
            Quantity: [element.Quantity, Validators.required],
            ICMS: [element.ICMS, Validators.required],
            PIS: [1.65, Validators.required],
            COFINS: [7.6, Validators.required],
            Comission: [element.Comission, Validators.required],
            Ship: [element.Shipment, Validators.required],
            Margin: [element.Margin, Validators.required]
          }));
        })
        this.isSavedSimulation = false;
        this.goClicked = false;
        this.isLoading = false;
      }, err => {
        console.log(err)
      })
  }

  batchSimulation() {
    this.apiService.batchSimulation(this.dynamicForm.value)
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
        this.isSavedSimulation = false;
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
    this.toBeUpdated = true;
    this.isSavedSimulation = false;
    this.dynamicForm.reset();
    this.t.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.numberOfTickets = true;
    this.submitted = false;
    this.toBeUpdated = true;
    // this.t.reset();
    this.t.controls.forEach(group => group.get('Orders').reset());
    this.t.controls.forEach(group => group.get('productCode').reset());
    this.t.controls.forEach(group => group.get('Quantity').reset());
    this.t.controls.forEach(group => group.get('ICMS').reset());
    this.t.controls.forEach(group => group.get('Comission').reset());
    this.t.controls.forEach(group => group.get('Ship').reset());
    this.t.controls.forEach(group => group.get('Margin').reset());
  }

  onChangeInput() {
    this.toBeUpdated = true;
  }

  getUpdatedSimResultFlag($event) {
    this.simulationResultFlag = $event;
    this.getInitData();
  }

}
