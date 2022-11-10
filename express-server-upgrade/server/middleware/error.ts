export const handleE11000 = (error: any, doc: any, next: any) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const entries = Object.entries(error.keyValue);
    next(new Error(`The ${entries[0][0]}: '${entries[0][1]}' is already taken`));
  } else {
    next();
  }
};

export const handleRequiredField = (error: any, doc: any, next: any) => {
  if (error && error.message.includes('required')) {
    let errors = Object.keys(error.errors);
    let message = '';
    errors.forEach(error => message += `${error} is required.\n`);
    next(new Error(message));
  } else {
    next();
  }
}
