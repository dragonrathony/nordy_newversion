import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  dataType: "json",
  timeout: 100000,
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})
export class QuantitySimulationService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  quantitySimulation(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/quantitySimulation`,
      data,
      httpOptions
    )
  }

  quantitySimulationSave(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/quantitySimulationSave`,
      data,
      httpOptions
    )
  }

  quantitySimulationUpdate(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/quantitySimulationUpdate`,
      data,
      httpOptions
    )
  }

  getInitquantitySimData(orderQuotVal): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/getInitquantitySimData/${orderQuotVal}`,
      httpOptions
    );
  }

  getSavedSimulationById(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/getSavedSimulationById/${id}`,
      httpOptions
    );
  }

  getSavedOrderQuot(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/getSavedOrderQuot`,
      data,
      httpOptions
    )
  }
}
