// Import dependencies
import { request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// determine environment 
const env = process.env.NODE_ENV || 'development';

// prob need to salt/hash passwords in db
// maybe need to see if i need to encrypt/decrypt password and username as it hits the server
export const authenticateJWT = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config[env].secret, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            req.body = decoded;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export const authenticateJWTBoolean = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config[env].secret, (err: any, decoded: any) => {
            if (err) req.body = false;
            else req.body = true;
        });
    } 
    else req.body = false;
    next();
};