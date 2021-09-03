// Import dependencies
import Router from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { isAuthenticatedJWT, isLoggedIn } from '../middleware/auth';
import { requestBody } from '../middleware/log';
import { User } from '../models/user';
import UserService from '../services/user-service';

// determine environment 
const env = process.env.NODE_ENV || 'development';

const router = Router();

// create UserService
let userService: UserService = new UserService();

// POST to login with username and password
router.post('/login', requestBody, async (req, res) => {
    let user: User | null = await userService.getByCredentials(req.body);
    if (user) res.status(200).json({token: jwt.sign({ username: user.username, _id: user._id}, config[env].secret)});
    else res.status(401).send('Unauthorized. Your username or password is incorrect.');
});

// POST to signup a new user with username and password
router.post('/signup', requestBody, async (req, res) => {
    try {
        let user: User | null = await userService.post({...req.body, role: 'user'}); // prevent user from changing role
        if (user) res.status(201).json({token: jwt.sign({ username: user.username, _id: user._id}, config[env].secret)});
        else res.status(500).send('Problem creating user');
    } catch (error: any) {
        res.status(409).send(error.message);
    }
});

router.get('/current-user', [isAuthenticatedJWT, requestBody], (req: any, res: any) => res.send(req.body.decodedJWT));
router.get('/is-logged-in', [isLoggedIn, requestBody], (req: any, res: any) => res.send(req.body.isLoggedIn));

export default router;
