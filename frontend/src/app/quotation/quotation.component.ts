import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonServiceService } from '../commonservices.service';
import { ModalService } from '../_services';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
  quotColumns: string[] = ['Id', 'Login', 'Client', 'ProductCode', 'Quantity', 'DueDate', 'Price', 'seeMore', 'makeOrder'];
  quotData: MatTableDataSource<any>;
  isLoading = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public commonService: CommonServiceService, private modalService: ModalService) { }

  ngOnInit() {
    this.getQuotData();
  }

  getQuotData() {
    this.isLoading = true;
    this.commonService.getAllQuotation().subscribe(
      dataList => {
        this.quotData = new MatTableDataSource(dataList['result']);

        this.quotData.sort = this.sort;
        // this.quotData.forEach(element => {
        //   element.DueDate = new Date(element.DueDate).toISOString().substring(0, 10);
        // })
        this.isLoading = false;
      },
      err => console.log(err)
    );
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.quotData.filter = filterValue.trim().toLowerCase();
  }

  seeMore(id: any) {
    this.isLoading = true;
    this.commonService.getQuotationById(id).subscribe(
      dataList => {
        this.isLoading = false;
        let modalData = { type: "seeMore", data: dataList['result'] }
        this.modalService.openDialog(modalData)
      },
      err => console.log(err)
    )
  }

  makeOrder(id: any) {
    let modalData = { type: "confirm", msg: "Are you sure?" }
    this.modalService.openDialog(modalData)
      .afterClosed().subscribe(res => {
        if (res) {
          this.isLoading = true;
          this.commonService.makeOrder(id).subscribe(
            dataList => {
              this.getQuotData();
              this.isLoading = false;
            },
            err => console.log(err)
          )
        }
      })
  }

}
