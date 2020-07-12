import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    apiUrl: string = environment.apiUrl;
    httpOptions = {
        dataType: "json",
        headers: new HttpHeaders({ "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
    };
    constructor(private http: HttpClient, @Inject('BASE_URL') _baseUrl: string) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        //this.apiUrl = `http://localhost:8080`;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        console.log('api url', this.apiUrl)
        return this.http.post<any>(`${this.apiUrl}/api/login`, { username, password }, this.httpOptions)
            .pipe(map(user => {

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
