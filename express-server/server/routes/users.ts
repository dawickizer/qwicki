// Import dependencies
import { Router } from 'express';
import { isAuthenticatedJWT, isAdmin, isAuthorized } from '../middleware/auth';
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
router.get('/', [isAuthenticatedJWT, isAdmin], async (req: any, res: any) => {
    if (!req.body.isAdmin) return res.sendStatus(401);
    let users: User[] | null = await userService.getAll();
    if (users) res.status(200).json(users);
    else res.status(500).send('Problem getting users');
});

// POST one to many users
router.post('/', [isAuthenticatedJWT, isAdmin], async (req: any, res: any) => {
    if (!req.body.isAdmin) return res.sendStatus(401);
    try {
        let user: User | null = await userService.post(req.body);
        if (user) res.status(201).json({ user });
        else res.status(500).send('Problem creating user');
    } catch (error: any) {
        res.status(409).send(error.message);
    }
});

// GET one user.
router.get('/:id', [isAuthenticatedJWT, isAdmin, isAuthorized], async (req: any, res: any) => {
    if (!req.body.isAdmin && !req.body.isAuthorized) return res.sendStatus(401);
    let user: User | null = await userService.get(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(500).send('Problem getting user');
});

// PUT (update) one user.
router.put('/:id', [isAuthenticatedJWT, isAdmin, isAuthorized], async (req: any, res: any) => {
    if (!req.body.isAdmin && !req.body.isAuthorized) return res.sendStatus(401);
    try {
        let user: User | null = await userService.put(req.params.id, req.body);
        if (user) res.status(200).json(user);
        else res.status(500).send('Problem updating user'); 
    } catch (error: any) {
        res.status(409).send(error.message)
    }
});

// DELETE one to many users
router.delete('/', [isAuthenticatedJWT, isAdmin], async (req: any, res: any) => {
    if (!req.body.isAdmin) return res.sendStatus(401);
    console.log(req.query.ids);
    let result: any = await userService.deleteMany(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'Users deleted successfully', result: result });
    else res.status(500).send('Problem deleting users');
});

router.delete('/:id', [isAuthenticatedJWT, isAdmin, isAuthorized], async (req: any, res: any) => {
    if (!req.body.isAdmin && !req.body.isAuthorized) return res.sendStatus(401);
    console.log(req.params.id)
    let result: any = await userService.delete(req.params.id);
    if (result) res.status(200).json({ message: 'User deleted successfully', result: result });
    else res.status(500).send('Problem deleting user');
});

export default router;
