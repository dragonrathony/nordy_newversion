import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

const httpOptions = {
    dataType: "json",
    timeout: 100000,
    headers: new HttpHeaders({ "Content-Type": "application/json" })
};

const httpOptions1 =
{
    headers: new HttpHeaders({ 'Content-Type': 'application/json', }),
    responseType: 'text' as 'json'
};

@Injectable({
    providedIn: "root"
})
export class AdmProcessService {
    baseUrl: string = environment.apiUrl;
    constructor(private http: HttpClient, @Inject('BASE_URL') _baseUrl: string) { }

    addAdmProcesses(data: any): Observable<any> {
        return this.http.post<any>(
            this.baseUrl + "/api/addAdmProcess",
            { 'data': data },
            httpOptions
        );
    }

    getAdmProcesses(): Observable<string> {
        return this.http.get<string>(
            this.baseUrl + "/api/getAdmProcesses",
            httpOptions1
        );
    }

    updateAdmProcessesStatus(data: any): Observable<any> {
        return this.http.post<any>(
            this.baseUrl + "/api/updateAdmProcessesStatus",
            { 'data': data },
            httpOptions
        );
    }

    getAdmProcessById(data: any): Observable<string> {
        return this.http.post<any>(
            this.baseUrl + "/api/getAdmProcessById",
            { 'data': data },
            httpOptions
        );
    }

    editAdmProcesses(data: any): Observable<any> {
        return this.http.post<any>(
            this.baseUrl + "/api/editAdmProcesses",
            { 'data': data },
            httpOptions
        );
    }


}
