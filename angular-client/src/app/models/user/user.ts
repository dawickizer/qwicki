import { Car } from '../car/car';
export class User {
  _id?: string;
  name: string;
  age: number;
  cars?: Car[];
}
