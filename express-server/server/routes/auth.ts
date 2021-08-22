// Import dependencies
import Router from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { authenticateJWT, authenticateJWTBoolean } from '../middleware/auth';
import { User } from '../models/user';
import UserService from '../services/user-service';

// determine environment 
const env = process.env.NODE_ENV || 'development';

const router = Router();

// create UserService
let userService: UserService = new UserService();

// POST to login with username and password
router.post('/login', async (req, res) => {
    let user: User | null = await userService.getByCredentials(req.body);
    if (user) res.status(200).json({token: jwt.sign({ username: user.username, usernameRaw: user.usernameRaw, _id: user._id}, config[env].secret)});
    else res.status(401).send('Unauthorized. Your username or password is incorrect.');
});

// POST to signup a new user with username and password
router.post('/signup', async (req, res) => {
    let user: User | null = await userService.getByUsername(req.body.username);
    if (!user) {
        user = await userService.post(req.body);
        if (user) res.status(201).json({token: jwt.sign({ username: user.username, usernameRaw: user.usernameRaw, _id: user._id}, config[env].secret)});
        else res.status(500).send('Problem creating user');
    }
    else res.status(409).send('Username already exists');
});

router.get('/current-user', authenticateJWT, (req, res) => res.send(req.body));
router.get('/is-logged-in', authenticateJWTBoolean, (req, res) => res.send(req.body));

export default router;
