import CustomError from './CustomError';

export default class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}
