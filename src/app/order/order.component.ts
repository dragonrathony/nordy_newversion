import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { CommonServiceService } from '../commonservices.service';
import { ModalService } from '../_services';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderColumns: string[] = ['Id', 'Login', 'Client', 'ProductCode', 'Quantity', 'DueDate', 'Price', 'seeMore'];
  orderData: MatTableDataSource<any>;
  isLoading = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public commonService: CommonServiceService, private modalService: ModalService) { }

  ngOnInit() {
    this.getOrderData();
  }

  getOrderData() {
    this.isLoading = true;
    this.commonService.getAllOrders().subscribe(
      dataList => {
        this.orderData = new MatTableDataSource(dataList['result']);
        this.orderData.sort = this.sort;
        this.isLoading = false;
      },
      err => console.log(err)
    );
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.orderData.filter = filterValue.trim().toLowerCase();
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

}
