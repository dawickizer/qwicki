// Import dependencies
import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();

const accessTokenSecret = 'secret';
const users = [
    {
        username: 'Wick',
        password: 'password',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
];

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

// GET api listing.
router.post('/', (req, res) => {
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password); // find user in users
    if (user) res.json({token: jwt.sign({ username: user.username, role: user.role }, accessTokenSecret)}); // if user...sign jwt with payload and secret
    else res.send('Username or password incorrect');
});

router.get('/test', authenticateJWT, (req, res) => {
    if (req.body.role !== 'admin') res.sendStatus(401);
    else res.send(req.body);
});

export default router;
