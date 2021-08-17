// Import dependencies
import { Router } from 'express';
import { User } from '../models/user';
import UserService from '../services/user-service';

const router = Router();

// create UserService
let userService: UserService = new UserService();

// Middleware
let requestTime = (_req: any, _res: any, next: any) => {
  console.log('Time: ', Date.now());
  next();
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all users
router.get('/', async (_req: any, res: any) => {
    let users: User[] | null = await userService.getAll();
    if (users) res.status(200).json(users);
    else res.status(500).send('Problem getting users');
});

// Create one to many users
router.post('/', async (req: any, res: any) => {
    let users: User[] | User = await userService.post(req.body);
    if (users) res.status(201).json({ message: 'User created successfully', users: users });
    else res.status(500).send('Problem creating user');
});

// GET one user.
router.get('/:id', async (req: any, res: any) => {
    let user: User | null = await userService.get(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(500).send('Problem getting user');
});

// PUT (update) one user.
router.put('/:id', async (req: any, res: any) => {
    // let result = await userService.put(req.params.id, req.body);
    // if (result) res.status(200).json({ message: 'Users updated successfully', users: result });
    // else res.status(500).send('Problem updating user');
});

// DELETE one to many users
router.delete('/', async (req: any, res: any) => {
    let result: any = await userService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'User deleted successfully', result: result });
    else res.status(500).send('Problem deleting user');
});

export default router;
