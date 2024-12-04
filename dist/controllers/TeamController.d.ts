import { Request, Response } from "express";
export declare class TeamMemberController {
    static findMemberByEmail: (req: Request, res: Response) => Promise<any>;
    static addMemberById: (req: Request, res: Response) => Promise<any>;
    static removeMemberById: (req: Request, res: Response) => Promise<any>;
    static getProyectTeam: (req: Request, res: Response) => Promise<any>;
}
