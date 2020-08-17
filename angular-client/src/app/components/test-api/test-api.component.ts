import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';

@Component({
  selector: 'test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {

  // Declare empty list of people
  people: any[] = [];

  constructor(private apiService: ApiService) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllPeople();
  }

  // Add one person to the API
  addPerson(name, age) {
    this.apiService.addPerson(name, age).subscribe(response => {
      this.getAllPeople();
    });
  }

  // Get all users from the API
  getAllPeople() {
    this.apiService.getAllPeople().subscribe(response => {
      this.people = response;
    });
  }
}
