import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Process } from '../_models/Process';
import { NgForm,FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertService } from '../_services';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

declare var $: any;

@Component({
  selector: 'basic-table',
  templateUrl: './listprocessrecord.component.html',
  //styleUrls: ['./addproduct.component.scss']
})
export class ListprocessrecordComponent implements OnInit {
  elements: any = [];

  headElements = ['ID', 'Name','MachineCode','Quality','Eficiency','Availability','Status', 'SetupTime','SetupTimeUnity',
  'Cost','CostTimeUnity','SetupLoss','SetupLossUnity','Speed','SpeedUnity','SpeedTimeUnity','MinBatch',
  'MinBatchUnity','MaxBatch','MaxBatchUnity','GroupSpeed','GroupSpeedTimeUnity','GroupSpeedUnity',
  'GroupName','OnOff','EXTRAFIELDS', 'Action'];
  //listChar2:ProductChar1[]=[];
  loading:string="Loading wait......"
  serverresponse:string='';
  survey: FormGroup;
  paramProductBody=new Process();
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder) {

    Window["myComponent"] = this;


   }
   
  getExtrafieldStrcure(extrafield){
    extrafield=JSON.parse(extrafield);
    var extrfaild="<ul>";
    var objectkey=extrafield.keys();
    for(var i=0;i<extrafield.length;i++){
      //console.log(Object.keys(extrafield[i]));
      extrfaild+=Object.keys(extrafield[i])[0]+':'+extrafield[i][Object.keys(extrafield[i])[0]];
    }
    
    console.log(extrafield);
    return extrfaild+'</ul>'
  }

  getProcessRecord(){
    this.commonservice.getProcessRecord(3).subscribe(
      dataList => {
        dataList=JSON.parse(dataList);
       this.elements=dataList['result'];
       console.log(dataList);
       this.loading="";
       //console.log(     this.controlListString);
      },
      err => console.log(err)
    );
  }

  f: NgForm;
  ngOnInit(): void {
    this.getProcessRecord()
    //this.paramProductBody.Id=0;
  } 

  updateStatus(id,status){
    if(confirm("Are you sure to  "+status)) {      
      
      this.commonservice.updatePrcoessStatus({'status':status,'id':id}).subscribe(
        dataList => {
         
          //console.log(dataList.message);
          this.serverresponse=dataList.message;
          if(dataList.error==0){
            this.getProcessRecord()
            //this.paramProductBody.MachineName=""
          }
          //product.reset()
           // this.alertService.success("Add Product");
  
         
        },
        err => console.log(err)
      );
    }

  }

 
  

}
