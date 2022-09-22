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