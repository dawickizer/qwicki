import CustomError from './CustomError';

export default class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
