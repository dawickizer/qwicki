// Import dependencies
import { Router } from 'express';
const router = Router();

// Middleware
let requestTime = (_req: any, _res: any, next: any) => {
  console.log('Time: ', Date.now())
  next()
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all addresses
router.get('/', (_req, res) => {
    res.send('get addresses');
});

// Create a address.
router.post('/', (_req, res) => {
    res.send('post address');
});

// GET one addresses.
router.get('/:id', (_req, res) => {
    res.send('get address');
});

// PUT (update) one address.
router.put('/:id', (_req, res) => {
    res.send('put address');
});

// DELETE one address.
router.delete('/:id', (_req, res) => {
    res.send('delete address');
});

export default router;
