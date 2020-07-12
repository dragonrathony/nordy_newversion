import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Family } from '../_models/Family';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_services';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'cdk-drag-drop-connected-sorting-example',
  templateUrl: './editfamily.component.html',
  styleUrls: ['editfamily.component.css'],
  //styleUrls: ['./addproduct.component.scss']
})
export class EditfamilyComponent implements OnInit {
  elements: any = [];
  FamilyName: any;
  oldFamilName: any;
  Formfileds: any = { FamilyName: 'test' }
  todo = [

  ];

  done = [

  ];


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  loading: string = "Loading wait......"
  serverresponse: string = '';
  servererror: number = 0;
  paramFamilyBody = new Family();
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder, private route: ActivatedRoute) {

    Window["myComponent"] = this;


  }
  test() {
    //alert('hi')
    var ddd = $("customFormAdd")
    //console.log("testing");
    this.submitAddProduct();
  }

  getFamily() {
    this.commonservice.getFamilyByid(this.paramFamilyBody['FamilyName']).subscribe(
      dataList => {
        dataList = JSON.parse(dataList);
        this.elements = dataList['result'];
        for (let entry of this.elements) {
          this.done.push(entry.MachineName);
        }
        this.getProcess();
        this.loading = "";
        //console.log(     this.controlListString);
      },
      err => console.log(err)
    );
  }

  getProcess() {
    this.commonservice.getProcess().subscribe(
      dataList => {
        dataList = JSON.parse(dataList);
        this.elements = dataList['result'];
        for (let entry of this.elements) {
          if (this.done.indexOf(entry.MachineName) == -1 && entry.Status == "Active")
            this.todo.push(entry.MachineName);
        }

        this.loading = "";
        //console.log(     this.controlListString);
      },
      err => console.log(err)
    );
  }

  f: NgForm;
  ngOnInit(): void {


    this.route.paramMap.subscribe(params => {
      //console.log(params['params']["id"]);
      this.paramFamilyBody.FamilyName = params['params']["id"];
      console.log('family name is', this.paramFamilyBody['FamilyName'])
      this.oldFamilName = params['params']["id"];
      this.getFamily();
    });
    //this.paramProductBody.Id=0;
  }



  submitAddProduct() {

    this.commonservice.updateFamily({ FamilyName: this.paramFamilyBody.FamilyName, familyProcess: this.done, "oldFamilName": this.oldFamilName }).subscribe(
      dataList => {

        //console.log(dataList.message);
        this.servererror = dataList.error;
        this.serverresponse = dataList.message;
        if (dataList.error == 0) {

          //this.paramFamilyBody.FamilyName="";
          //this.done=[];
        }
        //product.reset()
        // this.alertService.success("Add Product");


      },
      err => console.log(err)
    );
    console.log(this.done, this.paramFamilyBody);



  }


}
