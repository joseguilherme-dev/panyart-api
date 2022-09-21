import {
    NextFunction,
    Request,
    Response
} from 'express';
import jwt from 'jsonwebtoken';

import {SECRET_KEY} from '../config';

export function generateJWT(userId: string) {
    return jwt.sign({id: userId}, SECRET_KEY, {expiresIn: 3600});
}

// JWT Authentication Middleware
export function authenticateJWT(req: Request, res: Response, next: NextFunction){
    const JWT: any = req.headers['authorization']
    jwt.verify(JWT, SECRET_KEY, (err: any) => {if (err) res.status(403).end()});
    next();
}