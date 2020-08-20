import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';

// components
import { User } from '../../models/user/user';
import { Car } from '../../models/car/car';
import { Address } from '../../models/address/address';

@Component({
  selector: 'test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {

  // Declare empty list of people
  users: User[] = [];

  constructor(private apiService: ApiService) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAll();
  }

  // Add one person to the API
  add(name, age) {
    let cars: Car[] = [
      {
        year: 2019,
        make: 'Toyota',
        model: 'Camry XSE',
        engine: '3.5L V6'
      },
      {
        year: 2007,
        make: 'Mercedes Benz',
        model: 'C280',
        engine: '2.5L 4cyl'
      }
    ];

    let address: Address = {
      primaryAddress: '7201 Trappers Pl',
      city: 'Springfield',
      state: 'VA',
      zip: '22153',
      country: 'USA'
    }

    let user: User = {
      name: name,
      age: age,
      cars: cars,
      address: address
    };

    this.apiService.add(user).subscribe(response => {
      this.getAll();
    });
  }

  delete() {
    this.apiService.delete(this.users[0]).subscribe(response => {
      this.getAll();
    });
  }

  get() {
    this.apiService.get(this.users[0]).subscribe((response: User) => {
      console.log(response);
    });
  }

  update() {
    this.users[0].name = 'JOE RAINES';
    this.apiService.update(this.users[0]).subscribe((response: User) => {
      console.log(response);
      this.getAll();
    });
  }

  // Get all users from the API
  getAll() {
    this.apiService.getAll().subscribe((response: User[]) => {
      this.users = response;
      console.log(this.users);
    });
  }
}
