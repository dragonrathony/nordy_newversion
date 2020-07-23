import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../_components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  openDialog(data) {
    return this.dialog.open(ModalComponent, {
      width: '300px',
      disableClose: false,
      data
    })
  }
}
