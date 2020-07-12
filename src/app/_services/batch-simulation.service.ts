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
export class BatchSimulationService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  batchSimulation(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/batchSimulation`,
      data,
      httpOptions
    )
  }

  batchSimulationSave(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/batchSimulationSave`,
      data,
      httpOptions
    )
  }

  batchSimulationUpdate(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/batchSimulationUpdate`,
      data,
      httpOptions
    )
  }

  getInitBatchSimData(orderQuotVal): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/getInitBatchSimData/${orderQuotVal}`,
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
