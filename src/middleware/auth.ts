import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User, { IUser } from "../models/User";

// REESCRIBIM,OS NUEVAMENTE REQUEST USER PARA PODER TENER EL USUARIO GLOBALMENTE
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// TODO: MIDDLEWARE QUE VERIFICA SI EN LOS HEADERS VIENE EL TOKEN

// PODEMOS USARLA EN CUALQIER RUTA QUE QUIERAMOS QIE ESTO VERIFIQUE EL TOKEN
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TOMAMOS EL TOKEN
  const bearer = req.headers.authorization;

  //   SI NO VIENE EL TOKEN DEVUELVE ERROR
  if (!bearer) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }

  // SI VIENE EL TOKEN LO SEPARAMOS
  const token = bearer.split(" ")[1];

  try {
    // VERIFICAMOS EL TOKEN PARA SABER SI ES VALIDO Y NO HA EXPIRADO
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DEL DECODEDE TOMAMOS EL DATO QUE GUARDAMOS EN EL JWT QUE ES EL ID DE USUARIO
    // Y BUSCAMOS EL USUARIO EN LA BASE DE DATOS SI EXISTE
    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select('_id name email')
    //   console.log("user ", user);

      if (user) {
        // SI EL USUARIO EXISTE DECLARAMOS UN GLOBAL AL IGUAL QUE CON PROJECT Y LO GUARDAMOS EN EL REQUEST GLOBAL
        req.user = user;
        next();
      } else {
        res.status(500).json({ error: "Token no válido" });
      }
    }
  } catch (error) {
    console.log("error", error);
    if (TokenExpiredError) {
      const error = new Error("Token expirado");
      return res.status(401).json({ error: error.message });
    }

    res.status(500).json({ error: "Token no válido" });
  }

  // console.log('token', token);


};
