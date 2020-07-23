import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Process } from '../_models/Process';
import { NgForm, FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from '../_services';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

declare var $: any;

@Component({
  selector: 'basic-table',
  templateUrl: './addprocessrecord.component.html',
  //styleUrls: ['./addproduct.component.scss']
})
export class AddprocessrecordComponent implements OnInit {
  elements: any = [];
  survey: FormGroup;
 
  //listChar2:ProductChar1[]=[];
  loading:string="Loading wait..."
  serverresponse:string='';
  serverError:number=0;
  Processrecord=[];
  questions:any=[];
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder) {
    Window["myComponent"] = this;
   }
   
  
  f: NgForm;
  ngOnInit(): void {
    this.survey = this.formBuilder.group({      
      BusinessUnity:'',
      Name:'',
      MachineCode:'',
      ProcessId:'',
      Quality:'',
      Eficiency:'',
      Availability:'',
      SetupTime:'',
      SetupTimeUnity:'',
      Cost:'',
      CostTimeUnity:'',
      SetupLoss:'',
      GroupSpeedTimeUnity:'',
      SetupLossUnity:'',
      Speed:'',
      SpeedUnity:'',
      SpeedTimeUnity:'',
      MinBatch:'',
      MinBatchUnity:'',
      MaxBatch:'',
      MaxBatchUnity:'',
      GroupSpeed:'',
      GroupSpeedUnity:'',
      GroupName:'',
      OnOff:'',
      EXTRAFIELDS:new FormArray([])

    });
    //this.paramProductBody.Id=0;

    this.getProcess();
  }
  
  getProcess(){
    this.commonservice.getProcess().subscribe(
      dataList => {
        dataList=JSON.parse(dataList);
       console.log(dataList);       
       this.Processrecord=dataList['result'];
      },
      err => console.log(err)
    );
  }

  getSelectedID(selectedId){
    for(var i=0;i<this.Processrecord.length;i++){
      if(selectedId==this.Processrecord[i]['Id']){
        return i;
      }
    }

  }

  escapeUnicode(str) {
    return str.replace(/[^\0-~]/g, function(ch) {
        return "\\u" + ("0000" + ch.charCodeAt().toString(16)).slice(-4);
    });
}

initQuestion(level) {
  return this.formBuilder.group({
    ExtraTextBox:new FormControl (""),    
  });
}

  get studentsArray(): FormArray {
    return this.survey.get('EXTRAFIELDS') as FormArray;
  }
  genreateForm(selectedId){
    selectedId=this.getSelectedID(selectedId);    
    let selectedrecord=this.Processrecord[selectedId];
    var EXTRAFIELDS=selectedrecord['EXTRAFIELDS'];
    EXTRAFIELDS=this.escapeUnicode(EXTRAFIELDS);
    EXTRAFIELDS=JSON.parse(EXTRAFIELDS);
    if(EXTRAFIELDS!=null){
      this.questions=EXTRAFIELDS['sections'][0]['questions'];
      var arr = <FormArray>this.survey['controls'].EXTRAFIELDS;
      arr.controls = [];
      console.log(this.questions);
      var listquestions=[];
      for(var i=0;i<this.questions.length;i++){
        if(this.questions[i]['questionTitle']!=''){          
          //arr.push(this.formBuilder.group(this.questions[i]['questionTitle']))
          let title=this.questions[i]['questionTitle'];
          var obj = {};
          if(this.questions[i]['questionType']=='Check Boxes' || this.questions[i]['questionType']=='radio')
          obj[title] = new FormArray([]);
          else
          obj[title] ='';
          arr.push(this.formBuilder.group(obj));
        }
      }
      //this.studentsArray.push(this.formBuilder.group({'ExtraTextBox':''}));
      console.log(listquestions)
      
      console.log(this.survey.value);
    }
    
  }

  public trackItem (index: number, item) {
    return item.trackId;
  }

  onCheckChange(event,filedname,i) {
    //console.log(i);
    const formArray: FormArray = this.survey.get('EXTRAFIELDS')['controls'][i].get(filedname) as FormArray;    
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  onSubmit(form){
    //var json = JSON.stringify(form.value);
    this.commonservice.addProcessrecord(form.value).subscribe(
      dataList => {
       
        //console.log(dataList.message);
        this.serverresponse=dataList.message;
        this.serverError=dataList.error;
        if(dataList.error==0){
          //this.getProcess()
          //this.paramProductBody.MachineName=""
        }
        //product.reset()
         // this.alertService.success("Add Product");

       
      },
      err => console.log(err)
    );
    console.log(form.value);
  }
  

}
