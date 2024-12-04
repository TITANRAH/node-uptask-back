import type { Request, Response, NextFunction } from "express";
import Project from "../models/Proyect";
import Task, { ITask } from "../models/Task";

//TODO: MIDDLEWARE PARA VER SI EXISTE UN PROYECTO

declare global {
  namespace Express {
    // LAS INTERFACES PERMITEN AGREGAR CAMPOS AL REPTIR EL NOMBRE DE LA INTERFACE
    // EN ESTE CASO AGREGAMOS UN PROJECT DEL TIPO IProject AL REQUEST GLOBAL
    // PARA LEERLO EN CUALQUIER LADO
    interface Request {
      task: ITask;
    }
  }
}

export async function taskExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;

    console.log(taskId);
    // ENCUENTRO LA TAREA SI LA ENCUENTRA SERA EL ID DE ESA TAREA QUE SE PASE EN EL ID DEL PROUECTO EN EL OBJETO TASK
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ error: error.message });
    }

    // HAY QUE DECLARAR UN GLOBAL REQUEST COMO ARRIBA Y EN ESTE CASO
    // UNA VEZ DECLARADO Y COMO UN MIDDLEWARE SE EJECTUA ANTES DE CUALQUIER COSA
    // DECIMOS QUE EL PROJECT DECLARADO EN LA INTERFACE DE REQUEST ES IGUAL AL PROJECT ENCONTRADO
    // ESTO HACE QUE PROJECT ESTE DISPONIBLE EN CUALQUIER LADO DEL REQUEST O DE LA APP
    // POR LOQ UE PUEDO LEERLO EN EL CONTROLADOR QUE NECESITE
    req.task = task;
    // SI EL PROYECTO NO EXISTE RETORNA UN ERROR
    // Y SI EXISTE CONTINUA CON LA SIGUIENTE FUNCION CON NEXT
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(400).json({ error: error.message });
  }

  next();
}
export function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {

  // console.log('manager -> ',req.project.manager.toString())
  // console.log('user ->',req.user.id.toString)

  console.log(req.user.id.toString() === req.project.manager.toString())
  if (req.user.id.toString() !== req.project.manager.toString()) {
    const error = new Error("Acción no válida");
    return res.status(400).json({ error: error.message });
  }

  next();
}
