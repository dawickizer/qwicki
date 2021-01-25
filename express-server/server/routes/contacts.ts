// Import dependencies
import { Router } from 'express';
import ContactService from '../services/contact-service';

const router = Router();

// create ContactService
let contactService = new ContactService();

// Middleware
let requestTime = (_req: any, _res: any, next: any) => {
  console.log('Time: ', Date.now());
  next();
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all contacts
router.get('/', async (_req: any, res: any) => {
    let result = await contactService.getAll();
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting contacts');
});

// Create one to many contacts
router.post('/', async (req: any, res: any) => {
    let result = await contactService.post(req.body);
    if (result) res.status(201).json({ message: 'Contact created successfully', contacts: result });
    else res.status(500).send('Problem creating contact');
});

// GET one contact.
router.get('/:id', async (req: any, res: any) => {
    let result = await contactService.get(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting contact');
});

// PUT (update) one contact.
router.put('/:id', async (req: any, res: any) => {
    let result = await contactService.put(req.params.id, req.body);
    if (result) res.status(200).json({ message: 'Contacts updated successfully', contacts: result });
    else res.status(500).send('Problem updating contact');
});

// DELETE one to many contacts
router.delete('/', async (req: any, res: any) => {
    let result = await contactService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'Contact deleted successfully', result: result });
    else res.status(500).send('Problem deleting contact');
});

export default router;
