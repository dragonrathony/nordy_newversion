import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService, AlertService } from '../_services';
import { CommonServiceService } from '../commonservices.service';
import { Location } from '@angular/common';


@Component({
  templateUrl: 'login.component.html'
  , styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        public commonSer: CommonServiceService,
   private location: Location
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        // this.router.navigate(["/home"]);

        // localStorage.setItem('currentUser', JSON.stringify(this.f.username.value, this.f.password.value));
        // this.currentUserSubject.next(user);

        // this.loading = false;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    //debugger;
                    if(data.length>0){
                        data[0].isUserLogin=true;
                      this.commonSer.setLoginDetail(data[0])
                      this.router.navigate(["/home"]);
                        location.reload();
                       
                    }
                    else{
                        alert("Invalid details")
                    this.alertService.error("Invalid details");
                    this.loading = false;
                    }
                },
                error => {
                    //alert(error)
                    this.alertService.error(error.statusText);
                    this.loading = false;
                });
    }
}
