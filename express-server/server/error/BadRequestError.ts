import CustomError from './CustomError';

export default class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}
