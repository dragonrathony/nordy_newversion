import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label, Color } from "ng2-charts";
import { Location } from "@angular/common";

@Component({
  selector: "app-batch-simulation-result",
  templateUrl: "./batch-simulation-result.component.html",
  styleUrls: ["./batch-simulation-result.component.css"],
})
export class BatchSimulationResultComponent implements OnInit {
  @Input() data: any;
  @Input() tax: any;
  @Output() simulationResultFlagChange = new EventEmitter<boolean>();
  isLoading = true;

  /**Initialize chart variable */
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 10,
          max: 110,
        }
      }]
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  finalProcesses: any = [];
  barChartColors: Color[] = [
    {
      backgroundColor: "rgba(0, 77, 128, 1)",
    },
  ];
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [];

  supply: any = []; admProcesses: any = []; globalCost: any = [];
  A: any = []; B: any = []; C0: any = []; formula: any = []; taxResult: any = []; sumOfOrders = 0;
  income = 0; printIncome; outcome = 0; printOutcome; result = 0; printResult;

  /** Mat table */
  globalCostColumns: string[] = ['position', 'orders', 'name', 'value'];
  supplyColumns: string[] = ['position', 'orders', 'name', 'value'];
  admProcessColumns: string[] = ['position', 'orders', 'simulation', 'cost'];
  conditionColumns: string[] = ['position', 'orders', 'simulation', 'ICMS', 'PIS', 'COFINS', 'Comission', 'Shipment', 'Margin', 'priceKg', 'priceOrder'];

  constructor(private _location: Location) { }

  getChartData(labels) {
    let returnVal = [];
    let values = this.data;

    for (let i = 0; i < values.length; i++) {
      let stackData = [];
      let stackVal = {};
      for (let j = 0; j < labels.length; j++) {
        let tempVal = values[i].batchSim[labels[j]] ? values[i].batchSim[labels[j]].machineLoad : 0;
        stackData.push(tempVal);
      }
      stackVal = {
        data: stackData,
        label: `Batch ${i + 1}`,
        stack: "a",
      };
      returnVal.push(stackVal);
    }
    return returnVal;
  }

  getChartLabel() {
    let returnLabel = [];
    for (let i = 0; i < this.data.length; i++) {
      let tempLabels = Object.keys(this.data[i].batchSim);
      if (tempLabels.length > returnLabel.length) {
        returnLabel = tempLabels;
      }
    }
    return returnLabel;
  }

  chartInit() {
    this.isLoading = true;
    this.barChartLabels = this.getChartLabel();
    this.barChartData = this.getChartData(this.barChartLabels);
  }

  /** Calculate Supply */
  getSupply() {
    let tempOutcome = 0;
    for (let i = 0; i < this.data.length; i++) {
      // Get B
      let quotationAPIResult = this.data[i].result[0];
      let keys = Object.keys(quotationAPIResult);
      let lastC1Index = keys.length - 3;
      let lastProcess = keys[lastC1Index];
      let C1 = quotationAPIResult[lastProcess].extraparma.C1.toFixed(2);
      this.B.push(C1);
      // Get FirstProcess C0
      let firstProcess = keys[0];
      let C0 = quotationAPIResult[firstProcess].extraparma.C0.toFixed(2); // first process's C0
      this.C0.push(C0);
      // Get A
      let updatedCost = Number(C0 / C1 * quotationAPIResult.Cost).toFixed(2);
      console.log('new cost, FirstProcessC0, LastProcessC1', updatedCost, C0, C1)
      this.A.push(updatedCost);
      // Get Formula
      let formula = this.data[i].Formula;
      this.formula.push(formula);
      // Calculate Supply
      let supply = C0 * formula * this.tax.data[i].Orders;
      // outcome calculation
      tempOutcome += supply;
      supply = Number(supply.toFixed(2));
      // for mat table
      let element = { position: 0, orders: '', name: '', value: 0 }
      element.position = i + 1;
      element.orders = this.tax.data[i].Orders;
      element.name = `Batch ${i + 1}`;
      element.value = supply;
      this.supply.push(element)
    }
    console.log('(3)-sum of supply', tempOutcome)
    this.outcome += tempOutcome;
  }

  /** Calculate adm processes */
  getAdmProcesses() {
    for (let i = 0; i < this.data.length; i++) {
      // Factory time limit, Total process time, percentage
      let factoryTimeLimit = this.data[i].timeLimit; // Sum of Shift
      let originTime = this.data[i].result[0].Time; // Totoal process time
      let processTime = Number(originTime * this.C0[i] / this.B[i]).toFixed(2)
      console.log('updated time', processTime, originTime)
      let percentage = parseFloat(processTime) / factoryTimeLimit;
      console.log('percentage', percentage, factoryTimeLimit)

      // adm processes
      let admProcesses = this.data[i].admProcesses;
      let tempProcesses = [];
      let temp = { position: 0, orders: '', simulation: '', cost: '' };
      temp.position = i + 1;
      temp.orders = this.tax.data[i].Orders;
      temp.simulation = `Batch ${i + 1}`;
      let Cost = 0;
      admProcesses.map(el => {
        Cost += el.Cost * percentage;
      });
      temp.cost = Cost.toFixed(2);
      tempProcesses.push(temp)
      this.admProcesses.push(tempProcesses)
    }
    for (let i = 0; i < this.admProcesses.length; i++) {
      this.finalProcesses = [...this.finalProcesses, ...this.admProcesses[i]] // make array as one
    }

    // outcome calculation
    let tempOutcome = 0;
    for (let i = 0; i < this.data[0].admProcesses.length; i++) {
      tempOutcome += this.data[0].admProcesses[i].Cost
    }
    console.log('(1)-sum of admprocess cost', tempOutcome / this.tax.data[0].Orders)
    this.outcome += tempOutcome / this.tax.data[0].Orders
  }

  getGlobalCost() {
    for (let i = 0; i < this.data.length; i++) {
      let sum = 0;
      // sum = this.tax.data[i].Orders * this.taxResult[i].priceOrder // GlobalCost = Orders * priceOrder
      sum = parseFloat(this.A[i]) + parseFloat(this.supply[i].value) + parseFloat(this.admProcesses[i][0].cost);
      console.log('A is', this.A[i]);
      console.log('supply is', this.supply[i].value);
      console.log('admProcesses cost is', this.admProcesses[i][0].cost);
      // for mat table
      let element = {}
      element['position'] = i + 1;
      element['orders'] = this.tax.data[i].Orders;
      element['name'] = `Batch ${i + 1}`;
      element['value'] = sum.toFixed(2);
      this.globalCost.push(element)
    }
  }

  getIncome() {
    let singlePriceOrder = 0;
    let inputParams = this.tax.data;
    let calculated = 0;
    calculated = 1 - (parseFloat(inputParams[0].ICMS) + parseFloat(inputParams[0].PIS) + parseFloat(inputParams[0].COFINS) + parseFloat(inputParams[0].Comission) + parseFloat(inputParams[0].Ship) + parseFloat(inputParams[0].Margin)) / 100;
    // get single price order
    let singleORderGlobalCost = parseFloat(this.A[0]) + (parseFloat(this.supply[0].value) + parseFloat(this.admProcesses[0][0].cost)) / this.tax.data[0].Orders;
    singlePriceOrder = Number((singleORderGlobalCost / calculated).toFixed(2));
    console.log('singleORderGlobalCost---singlePriceOrder', singleORderGlobalCost, singlePriceOrder)
    // income calculation
    console.log('sumOfOrders', this.sumOfOrders)
    this.income = singlePriceOrder * this.sumOfOrders;

    this.outcome = Number(this.outcome.toFixed(2));
    this.result = Number((this.income - this.outcome).toFixed(2));
    // Formating commas as thousands separator
    let nfObject = new Intl.NumberFormat('en-US');
    this.printOutcome = nfObject.format(this.outcome);
    this.printResult = nfObject.format(this.result);
    this.printIncome = nfObject.format(this.income);

    this.isLoading = false;
    console.log('Income', this.income)
    console.log('Outcome', this.outcome)
    console.log('Result', this.result)
  }

  getTax() {
    let inputParams = this.tax.data;
    let tempOutcome = 0;
    for (let i = 0; i < inputParams.length; i++) {
      let priceOrder = 0; let priceKg = 0; let tempResult = {};
      // calculation
      let calculated = 0;
      calculated = 1 - (parseFloat(inputParams[i].ICMS) + parseFloat(inputParams[i].PIS) + parseFloat(inputParams[i].COFINS) + parseFloat(inputParams[i].Comission) + parseFloat(inputParams[i].Ship) + parseFloat(inputParams[i].Margin)) / 100;
      console.log('globalCost', this.globalCost)
      priceOrder = Number((this.globalCost[i].value / calculated).toFixed(2));
      priceKg = Number((priceOrder / this.C0[i]).toFixed(2));
      // make tax result
      tempResult['position'] = i + 1;
      tempResult['orders'] = this.tax.data[i].Orders;
      tempResult['simulation'] = `Batch ${i + 1}`;
      tempResult['ICMS'] = inputParams[i].ICMS;
      tempResult['PIS'] = inputParams[i].PIS;
      tempResult['COFINS'] = inputParams[i].COFINS;
      tempResult['Comission'] = inputParams[i].Comission;
      tempResult['Shipment'] = inputParams[i].Ship;
      tempResult['Margin'] = inputParams[i].Margin;
      tempResult['priceKg'] = priceKg;
      tempResult['priceOrder'] = priceOrder;
      this.taxResult.push(tempResult);
      // Get sum of orders
      this.sumOfOrders += this.tax.data[i].Orders;
      // outcome calculation
      tempOutcome += priceOrder * (parseFloat(inputParams[i].ICMS) + parseFloat(inputParams[i].PIS) + parseFloat(inputParams[i].COFINS) + parseFloat(inputParams[i].Comission) + parseFloat(inputParams[i].Ship)) / 100
    }

    console.log('(4)-sum of priceorder', tempOutcome)
    this.outcome += tempOutcome
    //  (Shift A + Shift B + Shift C + Shift D+ Shift E) * Cost [Every Machine]
    console.log('(2)-SumShift', this.data[0].SumShift)
    this.outcome += this.data[0].SumShift;

    
  }

  async ngOnInit() {
    this.chartInit();
    this.getSupply();
    this.getAdmProcesses();
    this.getGlobalCost();
    this.getTax();
    this.getIncome();
  }

  backToBatchSim() {
    this.simulationResultFlagChange.emit(false);
  }
}
