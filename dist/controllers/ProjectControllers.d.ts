import type { Request, Response } from "express";
export declare class ProjectController {
    static createProject: (req: Request, res: Response) => Promise<void>;
    static getAllProjects: (req: Request, res: Response) => Promise<void>;
    static getProjectById: (req: Request, res: Response) => Promise<any>;
    static udpateProyect: (req: Request, res: Response) => Promise<void>;
    static deleteProyect: (req: Request, res: Response) => Promise<void>;
}
