// Middleware
export const requestTime = (req: any, res: any, next: any) => {
    console.log('Time: ', Date.now());
    next();
  }

export const requestBody = (req: any, res: any, next: any) => {
    console.log(req.body)
    next();
}