import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { CommonServiceService } from '../commonservices.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'machine-processlist',
	templateUrl: './processlist.component.html',
	styleUrls: ['./processlist.component.css'],
})
export class MachineProcessLists implements OnInit {
	@ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective

	constructor(public commonservice: CommonServiceService, private route: ActivatedRoute) {
	}

	serverresponse: string = '';
	isLoading: Boolean = false;

	elements: any = [];
	headElements = ['Code', 'Description', 'Status', 'Edit'];
	searchText: string = '';
	previous: string;
	processid: string;
	processname: string;

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			this.processid = params['params']["id"];
			this.processname = params['params']["processname"];
			this.getProcessRecord();
		});
	}


	getProcessRecord() {
		this.isLoading = true;
		this.commonservice.getProcessRecord(this.processid).subscribe(
			dataList => {
				dataList = JSON.parse(dataList);
				this.mdbTable.setDataSource(dataList['result']);
				this.previous = this.mdbTable.getDataSource();
				this.elements = dataList['result'];
				this.isLoading = false;
			},
			err => console.log(err)
		);
	}


	updateStatus(id, status) {
		let str = status === '1' ? 'activate' : 'deactivate';
		let msg = `Are you sure to ${str}`;
		if (confirm(msg)) {
			this.isLoading = true;
			this.commonservice.updateMachineStatus({ 'status': status, 'id': id }).subscribe(
				dataList => {
					this.serverresponse = dataList.message;
					if (dataList.error == 0) {
						this.getProcessRecord()
						this.isLoading = false;
					}
				},
				err => console.log(err)
			);
		}
	}

}
