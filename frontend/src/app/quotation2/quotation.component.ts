import { Component, OnInit } from '@angular/core';
import { Quotation } from '../_models/quotation';
import { CommonServiceService } from '../commonservices.service';
import { NgForm } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent2 implements OnInit {
  submitStatusBol : boolean =true;
  quotationParam=new Quotation();
  listQuotation:any[]=[];
  keysQuotation:any[]=[];
  quentity:any=0;
  code:any=0;
  minimumcost:any=0;
  // inputlistQuotation:any[]=[];
  
  constructor(public commonservice: CommonServiceService) { }
  f: NgForm;
  ngOnInit(): void {
  }

  submitQuotation(data:any){
    console.log(data)
    this.commonservice.searchQuotationByPCodeQty(this.quotationParam.productCode,this.quotationParam.quantidade,'true').subscribe(
      dataList => {
       console.log(dataList)
       if(dataList['result']['result'].length){
        this.keysQuotation = Object.keys(dataList['result']['result'][0]);
        console.log(this.keysQuotation);
        this.listQuotation=dataList['result']['result'];
        console.log(this.listQuotation);

        this.quentity=dataList['result']['quentity'];
        this.code=dataList['result']['code'];

        this.minimumcost=dataList['result']['minimumcost'];

        $('#qProduct .nav-stacked').hide(0)
        $('a[href="#qProduct__submitedData"]').trigger('click');
       }
       else{
         alert('no record found!!')
       }
      },
      err => console.log(err)
      
    );
  }
  
  toggleClass($event){
     let node=$event.target.closest('tbody').children;
     var i;
     for (i = 0; i < node.length; i++) {
       node[i].classList.remove('active');
       if(i == node.length -1)
      $event.target.closest('tr').classList.toggle('active');
     }
    
  }
  onClickBackTab(){
    console.log('clicked')
    $('#qProduct .nav-stacked').show(0)
    $('a[href="#qProduct__form"]').trigger('click');
  }
}
