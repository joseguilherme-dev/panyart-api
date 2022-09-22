import {
    NextFunction,
    Request,
    Response
} from 'express';

import { isUserStaff } from '../utils/staff';

export async function isStaffMiddleware(req: Request, res: Response, next: NextFunction){
    /*
     *      This middleware verifies if the user is either a staff or not.
     */
    if(req.body.isAuthenticated === true)
        req.body.isStaff = await isUserStaff(req.body.authenticatedId)
    else 
        req.body.isStaff = false
    
    return next()
}

export function staffOnlyMiddleware(req: Request, res: Response, next: NextFunction){
    if (!req.body.isStaff) res.status(403).json({"msg": "Only staffs can execute this action."}).end(); else return next()
}