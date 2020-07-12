import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Process } from '../_models/Process';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_services';
import { MDBBootstrapModule, MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';

declare var $: any;

@Component({
  selector: 'basic-table',
  templateUrl: './listprocess.component.html',
  //styleUrls: ['./addproduct.component.scss']
})
export class ListprocessComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  elements: any = [];
  previous: any = [];

  headElements = ['Proc ID', 'Name', 'Status', 'Edit', 'Machines'];
  isLoading: Boolean = false;

  serverresponse: string = '';
  survey: FormGroup;
  paramProductBody = new Process();
  constructor(private cdRef: ChangeDetectorRef, public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder) {
    Window["myComponent"] = this;
  }
  test() {
    var ddd = $("customFormAdd")
    this.submitAddProduct();
  }

  getProcess() {
    this.isLoading = true;
    this.commonservice.getProcess().subscribe(
      dataList => {
        dataList = JSON.parse(dataList);
        this.mdbTable.setDataSource(dataList['result']);
        this.elements = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
        this.elements = dataList['result'];
        this.isLoading = false;
      },
      err => console.log(err)
    );
  }

  f: NgForm;
  ngOnInit() {
    this.getProcess();
  }

  updateStatus(id, status) {
    let msg = `Are you sure to ${status}`;
    if (confirm(msg)) {
      this.commonservice.updatePrcoessStatus({ 'status': status, 'id': id }).subscribe(
        dataList => {
          this.serverresponse = dataList.message;
          if (dataList.error == 0) {
            this.getProcess()
          }
        },
        err => console.log(err)
      );
    }
    else {
      return false;
    }
  }


  submitAddProduct() {
    this.commonservice.addFamily(this.paramProductBody).subscribe(
      dataList => {
        this.serverresponse = dataList.message;
        if (dataList.error == 0) {
          this.getProcess()
        }
      },
      err => console.log(err)
    );
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

}
