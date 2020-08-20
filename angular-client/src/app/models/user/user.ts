import { Car } from '../car/car';
import { Address } from '../address/address';

export class User {
  _id?: string;
  name: string;
  age: number;
  cars?: Car[];
  address?: Address;
}
