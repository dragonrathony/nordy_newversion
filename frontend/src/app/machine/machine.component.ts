import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Component({
  selector: 'machine',
  templateUrl: './machine.component.html',
  styleUrls: ['machine.component.css'],
})
export class MachineComponent implements OnInit {
  public data;
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.http.get(`${this.baseUrl}/api/getProcessMeachne`).subscribe((data) => {
      console.log(data['result'])
      this.data = data['result'];
    })
  }

}
