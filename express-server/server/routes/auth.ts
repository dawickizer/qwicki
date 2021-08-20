// Import dependencies
import Router from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import UserService from '../services/user-service';

const router = Router();

// create UserService
let userService: UserService = new UserService();

const accessTokenSecret = 'secret';

// prob need to salt/hash passwords in db
// prob need to make my secret more advanced
// maybe need to see if i need to encrypt/decrypt password and username as it hits the server
const authenticateJWT = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
            if (err) return res.sendStatus(403);

            req.body = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// POST to login with username and password
router.post('/login', async (req, res) => {
    let user: User | null = await userService.getByCredentials(req.body);
    if (user) res.status(200).json({token: jwt.sign({ username: user.username, usernameRaw: user.usernameRaw, _id: user._id}, accessTokenSecret)});
    else res.status(401).send('Unauthorized. Your username or password is incorrect.');
});

// POST to signup a new user with username and password
router.post('/signup', async (req, res) => {
    let user: User | null = await userService.getByUsername(req.body.username);
    if (!user) {
        user = await userService.post(req.body);
        if (user) res.status(201).json({token: jwt.sign({ username: user.username, usernameRaw: user.usernameRaw, _id: user._id}, accessTokenSecret)});
        else res.status(500).send('Problem creating user');
    }
    else res.status(409).send('Username already exists');
});

router.get('/test', authenticateJWT, (req, res) => {
    res.send(req.body);
});

export default router;
