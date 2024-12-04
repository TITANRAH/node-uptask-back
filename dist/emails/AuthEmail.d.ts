import { IToken } from "../models/Token";
import { IUser } from "../models/User";
interface IEmail {
    email: IUser["email"];
    name: IUser["name"];
    token: IToken["token"];
}
export declare class AuthEmail {
    static sendConfirmationEmail: (user: IEmail) => Promise<void>;
    static sendPasswordResetToken: (user: IEmail) => Promise<void>;
}
export {};
