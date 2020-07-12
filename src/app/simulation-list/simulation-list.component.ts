import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonServiceService } from '../commonservices.service';
import { ModalService } from '../_services';
import { MatPaginator } from '@angular/material';


@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css']
})
export class SimulationListComponent implements OnInit {

  isLoading = false;
  simulationColumns = ['No', 'SimulationName', 'Orders', 'ProductCode', 'Quantity', 'ICMS', 'PIS', 'COFINS', 'Comission', 'Shipment', 'Margin', 'Remove']
  simulationData: MatTableDataSource<any>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public commonService: CommonServiceService, private modalService: ModalService) { }

  ngOnInit() {
    this.getSimulationData();
  }

  getSimulationData() {
    this.isLoading = true;
    this.commonService.getSimulationData()
      .subscribe(result => {
        this.simulationData = new MatTableDataSource(result.result)
        this.simulationData.sort = this.sort;
        this.simulationData.paginator = this.paginator;
        this.isLoading = false;
      },
        err => console.log(err)
      )
  }

  remove(id) {
    let modalData = { type: "confirm", msg: 'Are you sure?' }
    this.modalService.openDialog(modalData)
      .afterClosed().subscribe(res => {
        if (res) {
          this.isLoading = true;
          this.commonService.removeSimulationData(id)
            .subscribe(result => {
              this.getSimulationData()
              this.isLoading = false;
            },
              err => console.log(err))
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.simulationData.filter = filterValue.trim().toLowerCase();
  }

}
