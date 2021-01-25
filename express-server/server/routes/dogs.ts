// Import dependencies
import { Router } from 'express';
import DogService from '../services/dog-service';

const router = Router();

// create DogService
let dogService = new DogService();

// Middleware
let requestTime = (_req: any, _res: any, next: any) => {
  console.log('Time: ', Date.now());
  next();
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all dogs
router.get('/', async (_req: any, res: any) => {
    let result = await dogService.getAll();
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting dogs');
});

// Create one to many dogs
router.post('/', async (req: any, res: any) => {
    let result = await dogService.post(req.body);
    if (result) res.status(201).json({ message: 'Dog created successfully', dogs: result });
    else res.status(500).send('Problem creating dog');
});

// GET one dog.
router.get('/:id', async (req: any, res: any) => {
    let result = await dogService.get(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting dog');
});

// PUT (update) one dog.
router.put('/:id', async (req: any, res: any) => {
    let result = await dogService.put(req.params.id, req.body);
    if (result) res.status(200).json({ message: 'Dogs updated successfully', dogs: result });
    else res.status(500).send('Problem updating dog');
});

// DELETE one to many dogs
router.delete('/', async (req: any, res: any) => {
    let result = await dogService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'Dog deleted successfully', result: result });
    else res.status(500).send('Problem deleting dog');
});

export default router;
