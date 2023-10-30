import CustomError from './CustomError';

export default class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = 403;
  }
}
