import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label, Color } from "ng2-charts";

@Component({
  selector: 'app-quantity-simulation-result',
  templateUrl: './quantity-simulation-result.component.html',
  styleUrls: ['./quantity-simulation-result.component.css']
})
export class QuantitySimulationResultComponent implements OnInit {

  @Input() data: any; // Simulation Result
  @Input() tax: any; // Input values
  @Output() simulationResultFlagChange = new EventEmitter<boolean>();
  isLoading = true;

  /**Initialize chart variable */
  lineChartOptions: ChartOptions = {
    responsive: true,
    // scales: {
    //   yAxes: [{
    //     ticks: {
    //       min: 0
    //     }
    //   }]
    // }
  };
  lineChartType: ChartType = "line";
  finalProcesses: any = [];
  lineChartColors: Color[] = [
    {
      borderColor: '#129ade',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];

  priceKgChartLabels: Label[] = [];
  priceOrderChartLabels: Label[] = [];

  priceOrderChartData: ChartDataSets[] = [];
  priceKgChartData: ChartDataSets[] = [];


  tempPriceKgData = []; tempPriceOrderData = [];

  constructor() { }

  ngOnInit() {
    this.chartInit();
  }

  chartInit() {
    this.isLoading = true;
    this.getBasicValues();
    this.getChartLabel();
    this.getChartData();
  }

  getChartLabel() {
    let labels = [];
    for (let i = 0; i < this.tax.data.length; i++) {
      labels.push(this.tax.data[i].Quantity);
    }
    this.priceKgChartLabels = labels;
    this.priceOrderChartLabels = labels;
  }

  getChartData() {
    let tempPriceOrderObj = {}
    let tempPriceKgObj = {}

    let priceKgData = [];
    let priceOrderData = [];

    tempPriceOrderObj['data'] = this.tempPriceOrderData;
    tempPriceOrderObj['label'] = 'Price / Order';

    tempPriceKgObj['data'] = this.tempPriceKgData;
    tempPriceKgObj['label'] = 'Price / Kg';

    priceOrderData.push(tempPriceKgObj);
    priceKgData.push(tempPriceOrderObj);

    this.priceOrderChartData = priceOrderData;
    this.priceKgChartData = priceKgData;
    this.isLoading = false;
  }

  // A, B, supply, admProcessCost
  getBasicValues() {
    let inputParams = this.tax;
    let calculated = 1 - (parseFloat(inputParams.ICMS) + parseFloat(inputParams.PIS) + parseFloat(inputParams.COFINS) + parseFloat(inputParams.Comission) + parseFloat(inputParams.Ship) + parseFloat(inputParams.Margin)) / 100;
    for (let i = 0; i < this.data.length; i++) {
      let quotationAPIResult = this.data[i].result[0];

      let keys = Object.keys(quotationAPIResult);
      let lastProcessIndex = keys[keys.length - 3];
      let firstProcessIndex = keys[0]

      // calculate the A and B
      let lastProcessC1 = quotationAPIResult[lastProcessIndex].extraparma.C1;
      let firstProcessC0 = quotationAPIResult[firstProcessIndex].extraparma.C0;
      // console.log("firstProcessC0", firstProcessC0)
      let quotationAPICost = quotationAPIResult.Cost;
      let A = firstProcessC0 / lastProcessC1 * quotationAPICost;


      // calculate the supply
      let Formula = this.data[i].Formula;
      let supply = firstProcessC0 * Formula;


      // calcuate the admProcessCost
      let factoryTimeLimit = this.data[i].timeLimit; // Sum of Shift
      let quotationAPITime = quotationAPIResult.Time; // Totoal process time
      let processTime = quotationAPITime * firstProcessC0 / lastProcessC1
      let percentage = processTime / factoryTimeLimit;

      let admProcesses = this.data[i].admProcesses;
      let admProcessCost = 0;
      admProcesses.map(el => {
        admProcessCost += el.Cost * percentage;
      });

      // calculate the globalCost
      let globalCost = 0;
      globalCost = A + supply + admProcessCost;

      let priceOrder = 0, priceKg = 0;
      priceOrder = Number((globalCost / calculated).toFixed(2));
      priceKg = Number((priceOrder / firstProcessC0).toFixed(2));
      this.tempPriceOrderData.push(priceOrder)
      this.tempPriceKgData.push(priceKg)
    }
  }

  backToQuantitySim() {
    this.simulationResultFlagChange.emit(false);
    // this._location.back();
  }
}

