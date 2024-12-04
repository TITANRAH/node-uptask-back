import type { Request, Response, NextFunction } from "express";
import { ITask } from "../models/Task";
declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}
export declare function taskExist(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function taskBelongsToProject(req: Request, res: Response, next: NextFunction): any;
export declare function hasAuthorization(req: Request, res: Response, next: NextFunction): any;
