import { Request, Response } from "express";
export declare class AuthController {
    static createAccount: (req: Request, res: Response) => Promise<any>;
    static confirmAccount: (req: Request, res: Response) => Promise<any>;
    static login: (req: Request, res: Response) => Promise<any>;
    static requestConfirmationCode: (req: Request, res: Response) => Promise<any>;
    static forgotPassword: (req: Request, res: Response) => Promise<any>;
    static validateToken: (req: Request, res: Response) => Promise<any>;
    static updatePasswordWithToken: (req: Request, res: Response) => Promise<any>;
    static user: (req: Request, res: Response) => Promise<any>;
    static updateProfile: (req: Request, res: Response) => Promise<any>;
    static updateCurrentUserPassword: (req: Request, res: Response) => Promise<any>;
    static checkPassword: (req: Request, res: Response) => Promise<any>;
}
