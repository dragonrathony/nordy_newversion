import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inner-component',
  templateUrl: './inner-component.component.html',
  styleUrls: ['./inner-component.component.css']
})
export class InnerComponentComponent implements OnInit {
  @Input()
  inputData: any;

  submitAddProduct(){
   //do you logic on this.inputData
  }
  constructor() { }

  ngOnInit() {
  }

}
