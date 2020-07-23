import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';
import { AdmProcessService } from '../_services';


@Component({
  //selector: 'app-adm-processes',
  selector: 'basic-table',
  templateUrl: './adm-processes.component.html',
  //styleUrls: ['./adm-processes.component.css']
})

export class AdmProcessesComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  elements: any = [];
  previous: any = [];
  headElements = ['Proc ID', 'Name', 'Cost', 'Status', 'Edit'];
  paramProductBody: any;

  constructor(private cdRef: ChangeDetectorRef, public apiService: AdmProcessService) {
    Window["myComponent"] = this;
  }

  getAdmProcesses() {
    this.apiService.getAdmProcesses().subscribe(
      dataList => {
        dataList = JSON.parse(dataList);
        this.elements = dataList['result'];

        this.mdbTable.setDataSource(this.elements);
        this.elements = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      },
      err => console.log(err)
    );
  }

  ngOnInit(): void {
    this.getAdmProcesses();
  }

  updateStatus(id, status) {
    if (confirm("Are you sure to " + status)) {
      this.apiService.updateAdmProcessesStatus({ 'status': status, 'id': id }).subscribe(
        dataList => {
          if (dataList.error) {
            alert("Error in updateing status")
          } else {
            this.getAdmProcesses()
          }
        },
        err => console.log(err)
      );
    }
    else {
      return false;
    }

  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }


}
