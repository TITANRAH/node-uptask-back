import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

//TODO: MIDDLWEARE DE ERRORES
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    // SI EL REQUEST TRAE ERRORES GUARDALOS EHN LA VARIABLE ERRORS
    // SI NO HAY ERRORES CONTINUA CON LA SIGUIENTE FUNCION 
    // OSEA EN ESTE CASO AL CONTROLADOR
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
