import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

const httpOptions = {
  dataType: "json",
  timeout: 100000,
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})
export class CashServiceService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  initChart(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/initChart`,
      httpOptions
    );
  }

  updateChart(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/updateChart`,
      data,
      httpOptions
    )
  }

}
