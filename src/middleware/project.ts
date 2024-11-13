import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Proyect";

//TODO: MIDDLEWARE PARA VER SI EXISTE UN PROYECTO

declare global {
  namespace Express {
    // LAS INTERFACES PERMITEN AGREGAR CAMPOS AL REPTIR EL NOMBRE DE LA INTERFACE
    // EN ESTE CASO AGREGAMOS UN PROJECT DEL TIPO IProject AL REQUEST GLOBAL
    // PARA LEERLO EN CUALQUIER LADO
    interface Request {
      project: IProject;
    }
  }
}

export async function projectExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId } = req.params;

    console.log(projectId);
    // ENCUENTRO LA TAREA SI LA ENCUENTRA SERA EL ID DE ESA TAREA QUE SE PASE EN EL ID DEL PROUECTO EN EL OBJETO TASK
    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error("proyecto no encontrado");
      return res.status(404).json({ error: error.message });
    }

    // HAY QUE DECLARAR UN GLOBAL REQUEST COMO ARRIBA Y EN ESTE CASO
    // UNA VEZ DECLARADO Y COMO UN MIDDLEWARE SE EJECTUA ANTES DE CUALQUIER COSA
    // DECIMOS QUE EL PROJECT DECLARADO EN LA INTERFACE DE REQUEST ES IGUAL AL PROJECT ENCONTRADO
    // ESTO HACE QUE PROJECT ESTE DISPONIBLE EN CUALQUIER LADO DEL REQUEST O DE LA APP
    // POR LOQ UE PUEDO LEERLO EN EL CONTROLADOR QUE NECESITE
    req.project = project;
    // SI EL PROYECTO NO EXISTE RETORNA UN ERROR
    // Y SI EXISTE CONTINUA CON LA SIGUIENTE FUNCION CON NEXT
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
