import { Component, OnInit } from '@angular/core';
import { Quotation } from '../_models/quotation';
import { CommonServiceService } from '../commonservices.service';
import { NgForm } from '@angular/forms';


declare var $: any;
@Component({
  selector: 'app-add-quotation',
  templateUrl: './addquotation.component.html',
  styleUrls: ['./addquotation.component.scss']
})


export class AddQuotationComponent implements OnInit {
  submitStatusBol: boolean = true;
  quotationParam = new Quotation();
  activeClass: Boolean[] = [];
  // product variables
  listQuotation: any[] = []; // product list
  keysQuotation: any[] = []; // product keys
  quentity: any = 0; // product quantity
  code: any = 0; // product code
  minimumcost: any = 0;
  FormulaCost = 0; FormulaCode = 0;

  // customer variables
  listCustomer: any[] = []; // customer list
  keysCustomer: any[] = []; // customer keys
  customer: any = 0; // customer id

  // conditions variables
  ICMS: any = 0; PIS: any = 1.65; COFINS: any = 7.6; Comission: any = 0; Shipment: any = 0; Margin: any = 0;
  priceKg: any = 0;
  priceOrder: any = 0;
  dueDate: any = 0; conditionFormSubmit = false;
  processData: any[] = [];
  A: any; B: any; Cost: any; quotTime: any; C0: any; // first process's C1

  // Supply & Adm Procceses
  supply = 0; admProcesses = [];
  Time = 1; TimeLimit = 0; globalCost = 0;

  isLoading = false;

  constructor(public commonservice: CommonServiceService) { }
  f: NgForm;
  ngOnInit(): void {
  }


  /**
   * Get B
   */
  getB(data) {
    let Keys = Object.keys(data);
    let index = Keys.length - 3; // get the last process name
    let lastProcess = Keys[index];
    let B = data[lastProcess].extraparma.C1;
    return B;
  }

  /** FirstProcess C1 */
  getFirstC1(data) {

  }

  /**
   * Get product by code and quantity
   * @param data 
   */
  submitQuotation() {
    if (!this.quotationParam.productCode || !this.quotationParam.quantidade) {
      return;
    }
    console.log("here submit quotation call")
    this.isLoading = true;
    this.commonservice.searchQuotationByPCodeQty(this.quotationParam.productCode, this.quotationParam.quantidade)
      .subscribe(dataList => {
        console.log('dataList', dataList)
        if (dataList['result']['result'].length) {
          console.log('quotationAPI result', dataList)
          this.handleQuotationAPIResult(dataList)
        }
        else {
          alert('no record found!!');
          this.isLoading = false;
        }
      },
        err => console.log(err)
      );
  }

  handleQuotationAPIResult(dataList) {
    console.log('handleQuotationAPIResult', dataList)
    this.keysQuotation = Object.keys(dataList['result']['result'][0]);
    this.listQuotation = dataList['result']['result'];
    // Round float && init
    var tempData = []
    this.listQuotation.forEach(item => {
      this.activeClass.push(false)
      Object.keys(item).forEach(function (key) {
        if (typeof item[key]['extraparma'] != 'undefined') {
          let tempProcessData = [];
          Object.keys(item[key]['extraparma']).forEach(function (i) {
            item[key]['extraparma'][i] = parseFloat(item[key]['extraparma'][i]).toFixed(2);
          })
          // Get process data for submit condition
          tempProcessData.push(key); // process name
          let time = item[key]['extraparma']['time'] ? item[key]['extraparma']['time'] : 0;
          tempProcessData.push(time);
          let cost = item[key]['extraparma']['cost'] ? item[key]['extraparma']['cost'] : 0;
          tempProcessData.push(cost);
          tempData.push(tempProcessData);
        }
      })
    })
    this.processData = tempData

    this.A = this.listQuotation[0].Cost; // original quotation API's cost
    this.B = this.getB(this.listQuotation[0]); // last process's C1

    let Keys = Object.keys(this.listQuotation[0]);
    let firstProcess = Keys[0];
    this.C0 = this.listQuotation[0][firstProcess].extraparma.C0; // first process's C0
    // Get Total Cost   
    // console.log('origin cost', this.listQuotation[0]['Cost'])
    this.Cost = Number((this.A * this.C0 / this.B).toFixed(2)); // originCost * FirstProcessC0 / LastProcessC1
    console.log('new cost, FirstProcessC0, LastProcessC1', this.Cost, this.C0, this.B)
    this.listQuotation[0]['Cost'] = this.Cost;

    // Make adm processes list
    this.Time = this.listQuotation[0].Time;
    console.log('originTime', this.Time)
    this.TimeLimit = dataList['result'].timeLimit;

    this.quotTime = Number((this.Time * this.C0 / this.B).toFixed(2)); // originTime * FirstProcessC0 / LastProcessC1

    let percentage = this.quotTime / this.TimeLimit;
    console.log('percentage', percentage, this.quotTime, this.TimeLimit)
    this.listQuotation[0]['Time'] = this.quotTime;

    this.admProcesses = [], this.globalCost = 0;
    dataList['result']['admProcesses'].map(el => {
      let temp = { Name: '', Cost: '' };
      let Cost = 0;
      temp.Name = el.Name;
      Cost = el.Cost * percentage
      this.globalCost += Cost;
      temp.Cost = Cost.toFixed(2);
      this.admProcesses.push(temp);
      // Add process data for submit quotation
      let admTemp = [];
      admTemp.push(temp.Name); // adm Process name
      admTemp.push(0); // Time is 0
      admTemp.push(temp.Cost); // adm process cost
      this.processData.push(admTemp);
    });
    // console.log('admProcesses', this.admProcesses)

    this.quentity = dataList['result']['quentity'];
    this.code = dataList['result']['code'];

    this.minimumcost = dataList['result']['minimumcost'];

    this.FormulaCost = dataList['result'].FormulaCost;
    this.FormulaCode = dataList['result'].FormulaCode;

    this.supply = this.C0 * this.FormulaCost;
    this.supply = Number(this.supply.toFixed(2));
    this.globalCost = Number(this.globalCost.toFixed(2))
    console.log('admProcess cost', this.globalCost)
    console.log('supply', this.supply)
    console.log('cost', this.Cost)
    this.globalCost = this.globalCost + this.supply + this.Cost;
    console.log('global cost', this.globalCost)

    this.isLoading = false;


    $('#qProduct .nav-stacked').hide(0)
    $('a[href="#qProduct__submitedData"]').trigger('click');
  }


  /**
   * Toggle function
   * @param $event 
   */
  toggleClass(index) {
    for (let i = 0; i < this.activeClass.length; i++) {
      if (index != i) {
        this.activeClass[i] = false;
      } else {
        this.activeClass[index] = !this.activeClass[index];
      }
    }
  }


  /**
   * Get customer by customer id
   * @param data 
   */
  submitCustomer() {
    this.isLoading = true;
    this.commonservice.searchCustomerById(this.quotationParam.customer).subscribe(
      dataList => {
        if (dataList['result'].length) {
          this.keysCustomer = Object.keys(dataList['result'][0]);
          this.listCustomer = dataList['result'];

          this.customer = this.quotationParam.customer;
          this.isLoading = false;
          $('#qClient__form').removeClass('active');
          $('#qClient__form').removeClass('in');
          $('#qClient__submitedData').addClass('active');
          $('#qClient__submitedData').addClass('in');
        }
        else {
          this.isLoading = false;
          alert('no record found!!')
        }
      },
      err => console.log(err)

    );
  }


  /**
   * Back to product tab
   */
  onClickBackTab() {
    $('#qProduct .nav-stacked').show(0);
    $('a[href="#qProduct__code"]').trigger('click');
  }


  /**
   * Back to client tab
   */
  backClientTab() {
    console.log('back to the client tab');
    $('#qClient__form').addClass('active');
    $('#qClient__form').addClass('in');
    $('#qClient__submitedData').removeClass('active');
    $('#qClient__submitedData').removeClass('in');
  }


  /** Quotation params change event */
  public changeQuotations(): void {
    if (!this.A && !this.B) {
      alert('Please first get quotation information in the Product part.')
      return;
    }
    // calculation
    let calculated = 0;
    calculated = 1 - (this.ICMS + this.PIS + this.COFINS + this.Comission + this.Shipment + this.Margin) / 100;
    // console.log('GlobalCost-calculated', this.globalCost, calculated)
    this.priceOrder = this.globalCost / calculated;
    this.priceOrder = this.priceOrder.toFixed(2)
    this.priceKg = this.priceOrder / this.C0;
    this.priceKg = this.priceKg.toFixed(2);
    if (!this.ICMS && !this.Shipment && !this.Comission && !this.Margin) {
      this.priceOrder = 0, this.priceKg = 0;
    }
  }

  /**
   * see invoice function
   */
  seeInvoice() {
    console.log('see invoice clicked', this.quotationParam.Margin)
  }

  /**
   * see invoice function
   */
  placeOrder() {
    console.log('place order clicked')
    if (!this.A && !this.B) {
      alert('Please first get quotation information in the Product part.')
      return;
    }
    if (!this.customer) {
      alert('Please select client.');
      return;
    }
    if (!this.dueDate) {
      alert('Please input due date.');
      return;
    }

    this.conditionFormSubmit = true;
    this.isLoading = true;

    // Prepare Quotation Header data
    // Get loggedIn user info
    let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    // kg - C1, m - C8, units - C9    
    let units = this.getUnits(this.listQuotation[0]);
    let headerData = {
      'ICMS': this.ICMS,
      'PIS': this.PIS,
      'COFINS': this.COFINS,
      'Comission': this.Comission,
      'Shipment': this.Shipment,
      'Margin': this.Margin,
      'Price': this.priceOrder,
      'ProductCode': this.code,
      'FormulaCode': this.FormulaCode,
      'FormulaCost': this.FormulaCost,
      'Quantity': this.quentity,
      'DueDate': this.dueDate,
      'Client': this.customer,
      'Login': loggedInUser[0].Id,
      'kg': units.kg,
      'meter': units.meter,
      'units': units.units
    };
    // Prepare Quotation Body data
    let data = {
      'headerData': headerData,
      'bodyData': this.processData
    }
    // console.log('data', data)
    /** Submit place order */
    this.commonservice.placeOrder(data).subscribe(
      result => {
        // console.log(result)
        this.isLoading = false;
        this.conditionFormSubmit = false;
        alert(result.message)
      },
      err => console.log(err)
    );

  }

  /** Date */
  date(e: any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.dueDate = convertDate;
  }

  /** get units */
  getUnits(data: any) {
    let Keys = Object.keys(data);
    let index = Keys.length - 3; // get the last process name
    let lastProcess = Keys[index];
    let kg = data[lastProcess].extraparma.C1;
    let meter = data[lastProcess].extraparma.C8;
    let units = data[lastProcess].extraparma.C9;
    return { kg, meter, units };
  }
}
