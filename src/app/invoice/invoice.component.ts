import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Family } from '../_models/Family';
import { NgForm,FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertService } from '../_services';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { MDBBootstrapModule,  MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';
declare var $: any;

@Component({
  selector: 'invoice-component',
  templateUrl: './invoice.component.html',
  styleUrls: ['invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective

  elements: any = [];
  previous: any = [];
  code:any;
  quentity:any;
  position:any;
  FamilyeName:any;
  currentTtime:any;
  processTIme:any;
  processCost:any;
  listQuotation:any[]=[];
  keysQuotation:any[]=[];
  Formfileds: any={FamilyeName:''}
  todo = [
    
  ];

  done = [
    
  ];

  headElements = ['Qty', 'Product Code#','Process #','Machine','Time','Subtotal'];

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

  
  loading:string="Loading wait......"
  serverresponse:string='';
  servererror:number=0;
  paramFamilyBody=new Family();
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder,private route: ActivatedRoute) {

    Window["myComponent"] = this;


   }
  //  test(){
  //    //alert('hi')
  //    var ddd=$("customFormAdd")
  //   //console.log("testing");
  //   this.submitAddProduct();
  // }

  // getFamily(){
  //   this.commonservice.getFamily().subscribe(
  //     dataList => {
  //       dataList=JSON.parse(dataList);
  //      this.elements=dataList['result'];
  //      for (let entry of this.elements) {
  //       console.log(entry); // 1, "string", false
  //       this.todo.push(entry.MachineName);
  //       }
       
  //      this.loading="";
  //      //console.log(     this.controlListString);
  //     },
  //     err => console.log(err)
  //   );
  // }

  f: NgForm;
  ngOnInit(): void {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.currentTtime = mm + '/' + dd + '/' + yyyy;
    this.route.paramMap.subscribe(params => {
      //console.log(params['params']["id"]);


      this.code=params['params']["code"];      
      this.quentity=params['params']["quentity"];
      this.position=params['params']["position"];
      this.commonservice.searchQuotationByPCodeQtyPostions(this.code,this.quentity,this.position).subscribe(
        dataList => {
         console.log(dataList)
         if(dataList['result']['result'].length){
          this.keysQuotation = Object.keys(dataList['result']['result'][0]);         
          this.listQuotation=dataList['result']['result'];
          this.processCost=dataList['result']['Cost'];
          this.processTIme=dataList['result']['Time'];
         }
         else{
           alert('no record found!!')
         }
        },
        err => console.log(err)
        
      );
    });
    
    // this.getFamily();
    for (let i = 1; i <= 6; i++) {
      this.elements.push({Id: i%2 == 0 ? '1' : '2', Product: 'Product ' + i, Serial: i%2 == 0 ? '1234' : '6789', Description: 'lorem ipsum dolor sit, lorem ipsum dolor sit, ' , SubTotal:  i});
    }

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
    console.log(this.mdbTable.getDataSource())
    //this.paramProductBody.Id=0;
  } 
  

  handleSubmitPayment(event){ 
    
  //   this.commonservice.addFamily({FamilyName:this.paramFamilyBody['FamilyeName'],familyProcess:this.done}).subscribe(
  //     dataList => {
       
  //       //console.log(dataList.message);
  //       this.servererror=dataList.error;
  //       this.serverresponse=dataList.message;
  //       if(dataList.error==0){
          
  //         this.paramFamilyBody.FamilyName="";
  //         this.done=[];
  //       }
  //       //product.reset()
  //        // this.alertService.success("Add Product");

       
  //     },
  //     err => console.log(err)
  //   );
    console.log('submitting payment');
    
   
    
  }
  
  // ngAfterViewInit() {
  //   this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);

  //   this.mdbTablePagination.calculateFirstItemIndex();
  //   this.mdbTablePagination.calculateLastItemIndex();
  //   // this.cdRef.detectChanges();
  // }
  printBtn(event){
    event.preventDefault();
    window.print();
  }
}
