// Import dependencies
import { Router } from 'express';
import CarService from '../services/car-service';

const router = Router();

// create CarService
let carService = new CarService();

// Middleware
let requestTime = (_req: any, _res: any, next: any) => {
    console.log('Time: ', Date.now())
    next()
  }

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all cars
router.get('/', async (_req: any, res: any) => {
    let result = await carService.getAll();
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting cars');
});

// Create one to many cars
router.post('/', async (req: any, res: any) => {
    let result = await carService.post(req.body);
    if (result) res.status(201).json({ message: 'Car created successfully', cars: result });
    else res.status(500).send('Problem creating car');
});

// GET one car.
router.get('/:id', async (req: any, res: any) => {
    let result = await carService.get(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting car');
});

// PUT (update) one car.
router.put('/:id', async (req: any, res: any) => {
    let result = await carService.put(req.params.id, req.body);
    if (result) res.status(200).json({ message: 'Cars updated successfully', cars: result });
    else res.status(500).send('Problem updating car');
});

// DELETE one to many cars
router.delete('/', async (req: any, res: any) => {
    let result = await carService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'Car deleted successfully', result: result });
    else res.status(500).send('Problem deleting car');
});

export default router;
