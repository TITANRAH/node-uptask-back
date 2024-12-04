interface NotePrams {
    noteId: Types.ObjectId;
}
import type { Request, Response } from "express";
import { INote } from "../models/Note";
import { Types } from "mongoose";
export declare class NoteController {
    static createNote: (req: Request<{}, {}, INote>, res: Response) => Promise<void>;
    static getTaskNotes: (req: Request, res: Response) => Promise<void>;
    static deleteNote: (req: Request<NotePrams>, res: Response) => Promise<any>;
}
export {};
