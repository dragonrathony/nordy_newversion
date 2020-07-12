import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { environment } from '../environments/environment';

const httpOptions = {
  dataType: "json",
  timeout: 100000,
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class CommonServiceService {
  userLoginDetails: any;
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {
    this.userLoginDetails = {};
    this.userLoginDetails.isUserLogin = false;
  }


  uploadFiles(fileData: FormData) {
    return this.http.post(this.baseUrl + '/api/UploadFile', fileData
      , {
        reportProgress: true,
        observe: 'events'
      }
    )
  }

  getLoginDetail() {
    if (localStorage.getItem("session") != null) {
      this.userLoginDetails = JSON.parse(localStorage.getItem("session"));
      return this.userLoginDetails;
    }
    else {
      this.userLoginDetails = {};
      this.userLoginDetails.isUserLogin = false;
      return this.userLoginDetails;
    }

  }

  setLoginDetail(user: any) {
    localStorage.setItem("session", JSON.stringify(user));
    this.userLoginDetails = user;
  }


  // init product form with product code
  initFormByProductCode(): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/initFormByProductCode", httpOptions1);
  }

  // init product form with product code
  initFormByQuantity(): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/initFormByQuantity", httpOptions1);
  }

  productSaveWithQuantity(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/productSaveWithQuantity",
      { 'raw': data },
      httpOptions
    );
  }

  productSaveWithProductCode(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/productSaveWithProductCode",
      { 'raw': data },
      httpOptions
    );
  }

  addProcessrecord(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/addProcessrecord",
      { 'raw': data },
      httpOptions
    );
  }

  updateProcessrecord(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/updateProcessrecord",
      { 'raw': data },
      httpOptions
    );
  }

  addPrcoess(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/processSave",
      { 'raw': data },
      httpOptions
    );
  }

  processUpdate(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/processUpdate",
      { 'raw': data },
      httpOptions
    );
  }


  updatePrcoessStatus(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/updatePrcoessStatus",
      { 'raw': data },
      httpOptions
    );
  }
  
  updateMachineStatus(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/updateMachineStatus",
      { 'raw': data },
      httpOptions
    );
  }

  addFamily(data: any) {
    return this.http.post<any>(
      this.baseUrl + "/api/familysave",
      { 'raw': data },
      httpOptions
    );
  }

  updateFamily(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/familyUpdate",
      { 'raw': data },
      httpOptions
    );
  }

  getFamily(): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/getFamily", httpOptions1);
  }

  getFamilyByid(name): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/getFamilyByid/" + name, httpOptions1);
  }

  getProcess(): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/getProcess", httpOptions1);
  }

  getProcessRecord(processid): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/getProcessRecord/" + processid, httpOptions1);
  }

  getProcessid(id): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/getProcessByid/" + id, httpOptions1);
  }

  getProcessRecordByid(id): Observable<string> {
    let httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this.http.get<string>(
      this.baseUrl + "/api/getProcessRecordByid/" + id, httpOptions1);
  }

  managePostFlowQuotation(productCode: string, quantidade: number): Observable<any[]> {
    return this.http.post<any[]>(
      this.baseUrl + "/api/Flow?productCode=" + productCode + "&quantidade=" + quantidade,
      httpOptions
    );
  }
  searchQuotationByPCodeQty(productCode: string, quantidade: number, showall: string = 'false'): Observable<any[]> {
    return this.http.get<any[]>(
      this.baseUrl + "/api/getQuotations/" + productCode + "/" + quantidade + "/" + showall,
      httpOptions
    );
  }

  searchQuotationByPCodeQtyPostions(productCode: string, quantidade: number, position: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.baseUrl + "/api/getQuotations/" + productCode + "/" + quantidade + "/" + position,
      httpOptions
    );
  }

  searchCustomerById(Customer: string): Observable<any[]> {
    return this.http.get<any[]>(
      this.baseUrl + "/api/getCustomer/" + Customer,
      httpOptions
    );
  }

  /** Place order API for Quotation condition */
  placeOrder(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/placeOrder",
      data,
      httpOptions
    );
  }

  /** Get Quotation data */
  getAllQuotation(): Observable<string> {
    return this.http.get<string>(
      this.baseUrl + "/api/getAllQuotation/",
      httpOptions
    );
  }

  getQuotationById(id: any): Observable<string> {
    return this.http.get<string>(
      this.baseUrl + "/api/getQuotationById/" + id,
      httpOptions
    );
  }

  makeOrder(id: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "/api/makeOrder/",
      { 'id': id },
      httpOptions
    );
  }

  /** Get Order data */
  getAllOrders(): Observable<string> {
    return this.http.get<string>(
      this.baseUrl + "/api/getAllOrders/",
      httpOptions
    );
  }

  /** Get Saved simulation data */
  getSimulationData(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/getSimulationData`,
      httpOptions
    )
  }

  /** Remove simulation data */
  removeSimulationData(id): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/removeSimulationdata`,
      { 'data': id },
      httpOptions
    )
  }
}
