import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { CommonServiceService } from '../commonservices.service';
import { NotificationService } from '../_services';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})
export class AddproductComponent implements OnInit {
  isLoading: Boolean = true;
  productAddForm: FormGroup;
  formBody: any[] = [];

  constructor(
    public commonservice: CommonServiceService,
    private notifyService: NotificationService,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initAddProductForm();
  }

  initAddProductForm(): void {
    this.commonservice.initFormByProductCode().subscribe(
      dataList => {
        this.formBody = JSON.parse(dataList);
        let group = {}
        this.formBody.forEach(element => {
          group[element.name] = ['', Validators.required]
        })
        this.productAddForm = this.fb.group(group)
        this.isLoading = false;
      },
      err => console.log(err)
    );
  }

  submitAddProduct() {
    if (this.productAddForm.invalid) {
      return;
    }
    let product = this.productAddForm.value;
    this.isLoading = true;
    // console.log('add product clicked!!!', product);
    this.commonservice.productSaveWithProductCode(product).subscribe(
      result => {
        this.isLoading = false;
        if (result.error) {
          console.log('error occured', result)
          this.notifyService.showError(result.message, "Nordy")
        } else {
          this.notifyService.showSuccess(result.message, "Nordy")
        }
      },
      err => console.log(err)
    );
  }
}
