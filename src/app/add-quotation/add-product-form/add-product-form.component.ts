import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonServiceService } from '../../commonservices.service';
import { NotificationService } from '../../_services';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.css']
})
export class AddProductFormComponent implements OnInit {
  @Output() quotationAPICall = new EventEmitter();

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
    this.commonservice.initFormByQuantity().subscribe(
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
    // console.log('add product by quantity clicked!!!', product);
    this.commonservice.productSaveWithQuantity(product).subscribe(
      result => {
        this.isLoading = false;
        if (result.error) {
          console.log('error occured', result)
          this.notifyService.showError(result.message, "Nordy")
        } else {
          console.log('addproductform', result)
          // this.notifyService.showSuccess(result.message, "Nordy")
          this.quotationAPICall.emit(result)
        }
      },
      err => console.log(err)
    );
  }

}
