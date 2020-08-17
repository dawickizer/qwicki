import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API = environment.EXPRESS_ENDPOINT;

  constructor(private http: HttpClient) { }

  // Add one person to the API
  addPerson(name, age): Observable<any> {
    return this.http.post(`${this.API}/users`, {name, age});
  }

  // Get all users from the API
  getAllPeople(): Observable<any> {
    return this.http.get(`${this.API}/users`);
  }
}
