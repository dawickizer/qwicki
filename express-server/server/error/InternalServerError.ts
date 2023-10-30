import CustomError from './CustomError';

export default class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500;
  }
}
