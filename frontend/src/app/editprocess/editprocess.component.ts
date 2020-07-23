import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Process } from '../_models/Process';
import { NgForm, FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from '../_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'basic-table',
  templateUrl: './editprocess.component.html',
})
export class EditprocessComponent implements OnInit {
  elements: any = [];
  survey: FormGroup;
  isLoading = false;
  serverresponse: string = '';
  serverError: number = 0;
  oldSurveryData: any = [];
  oldId: any = '';
  paramProductBody = new Process();
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    Window["myComponent"] = this;
  }


  f: NgForm;
  ngOnInit(): void {
    this.oldId = this.route.snapshot.params.id
    this.getProcessId();
  }

  getProcessId() {
    this.commonservice.getProcessid(this.oldId).subscribe(
      dataList => {
        dataList = JSON.parse(dataList);
        this.oldSurveryData = dataList;
        this.survey = this.formBuilder.group({
          sections: this.formBuilder.array([
            this.initSection(),
          ]),
        });
      },
      err => console.log(err)
    );
  }

  updateStatus(id, status) {
    if (confirm("Are you sure to  " + status)) {
      this.commonservice.updatePrcoessStatus({ 'status': status, 'id': id }).subscribe(
        dataList => {
          this.serverresponse = dataList.message;
        },
        err => console.log(err)
      );
    }

  }

  submitAddProduct() {
    this.commonservice.addFamily(this.paramProductBody).subscribe(
      dataList => {
        this.serverresponse = dataList.message;
      },
      err => console.log(err)
    );
  }


  initSection() {
    var extrafiled = JSON.parse(this.oldSurveryData['result']['EXTRAFIELDS'])
    var tempquestions = [];
    for (var i = 0; i < extrafiled['sections'][0]['questions'].length; i++) {
      tempquestions[i] = this.initQuestionN(extrafiled['sections'][0]['questions'][i])
    }
    return this.formBuilder.group({
      MachineName: this.oldSurveryData['result']["MachineName"],
      ShiftA: this.oldSurveryData['result']['ShiftA'],
      ShiftB: this.oldSurveryData['result']['ShiftB'],
      ShiftC: this.oldSurveryData['result']['ShiftC'],
      ShiftD: this.oldSurveryData['result']['ShiftD'],
      ShiftE: this.oldSurveryData['result']['ShiftE'],
      questions: this.formBuilder.array(tempquestions),
      oldId: this.oldId,
    });
  }

  initQuestionN(qestions) {
    var tempquestions = [];
    for (var i = 0; i < qestions['options'].length; i++) {
      tempquestions[i] = this.initOptionsN(qestions['options'][i])
    }

    return this.formBuilder.group({
      questionTitle: [qestions.questionTitle],
      questionType: [qestions.questionType],
      options: new FormArray(tempquestions)
    });
  }

  initOptionsN(options) {
    return this.formBuilder.group({
      optionTitle: [options.optionTitle]
    });
  }

  initQuestionD() {
    return this.formBuilder.group({
      questionTitle: [],
      questionType: ["Free Text"],
      options: new FormArray([
        this.initOptions()
      ])
    });
  }

  initOptions() {
    return this.formBuilder.group({
      optionTitle: ['']
    });
  }


  addSection() {
    const control = <FormArray>this.survey.get('sections');
    control.push(this.initSection());
  }

  addQuestion(j) {
    const control = <FormArray>this.survey.get('sections')['controls'][j].get('questions');
    control.push(this.initQuestionD());

  }

  add(i, j) {
    const control = <FormArray>this.survey.get('sections')['controls'][i].get('questions').controls[j].get('options');
    control.push(this.initOptions());
  }

  getSections(form) {
    return form.controls.sections.controls;
  }
  getQuestions(form) {
    return form.controls.questions.controls;
  }
  getOptions(form) {
    return form.controls.options.controls;
  }

  removeQuestion(j) {
    const control = <FormArray>this.survey.get('sections')['controls'][j].get('questions');
    control.removeAt(j);
  }

  removeSection(i) {
    const control = <FormArray>this.survey.get('sections');
    control.removeAt(i);

  }

  removeOption(i, j) {
    const control = <FormArray>this.survey.get(['sections', i, 'questions', j, 'options']); // also try this new syntax
    control.removeAt(i);

  }

  getCurrentFieldType(i, j) {
    const control = <FormArray>this.survey.get('sections')['controls'][i].get('questions');
    return control.value[j].questionType;
  }

  onSubmit(form) {
    this.commonservice.processUpdate(form.value).subscribe(
      dataList => {
        this.serverresponse = dataList.message;
        this.serverError = dataList.error;
      },
      err => console.log(err)
    );
  }

}
