// Import dependencies
import Router from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import UserService from '../services/user-service';


const router = Router();

// create UserService
let userService = new UserService();

const accessTokenSecret = 'secret';

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
    let user: User | null = await userService.getByLoginCredentials(req.body);
    if (user) res.status(200).json({token: jwt.sign({ username: user.username, _id: user._id}, accessTokenSecret)});
    else res.status(401).send('Unauthorized. Your username or password is incorrect.');
});

router.get('/test', authenticateJWT, (req, res) => {
    res.send(req.body);
});

export default router;


    // login flow
// User hits the login endpoint with username and password
// Check the db if the username and password exists (username/password prob need to be hash/salted in db)
// If not found...return error message saying username or password incorrect
// If valid user...sign a JWT with payload and secret (secret should probably be advanced with crypto etc)
