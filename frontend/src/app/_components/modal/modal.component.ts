import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  confirmModalFlag = false;
  simulationAddModalFlag = false;
  seeMoreModalFlag = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ModalComponent>) { }

  ngOnInit() {
    switch (this.data.type) {
      case "confirm":
        this.confirmModalFlag = true;
        break;
      case "addSimulation":
        this.simulationAddModalFlag = true;
        break;
      case "seeMore":
        this.seeMoreModalFlag = true;
        break;
      default:
        break;
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
