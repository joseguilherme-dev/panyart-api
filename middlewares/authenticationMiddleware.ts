import {
    NextFunction,
    Request,
    Response
} from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

export default async function authenticationMiddleware(req: Request, res: Response, next: NextFunction){
    /*
     *      This middleware verifies if the user is authenticated using JWT stored in the cookies.
     */
    if(!req.cookies.hasOwnProperty('jwt')){
        req.body.isAuthenticated = false
        return next()
    } else {
        const isJWTValid: any = await jwt.verify(req.cookies.jwt, SECRET_KEY, (err: any) => {
            if (err) return err; else return jwt.decode(req.cookies.jwt, SECRET_KEY)
        });
        // If an error has not ocurred during the verification of JWT
        // that means the JWT is valid, and the user is properly authenticated:
        if (!isJWTValid.hasOwnProperty('name')){ // Errors has 'name' property on it, containing the error name.
            req.body.isAuthenticated = true
            return next()
        } else {
            // But if an error has ocurred, it's time to verify it's type. 
            if(isJWTValid.name === 'JsonWebTokenError')
                // If the token is simply invalid (made up or something) it's time to end the request.
                return res.status(403).json({msg: "Invalid JWT token."}).end()
            else {
                // If the token has expired, let's also end the request, the user should log in again.
                return res.status(403).json({msg: "JWT token has expired."}).end()
            }
        }
    }    
}