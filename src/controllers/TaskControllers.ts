import type { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Proyect";

// TODO: TASK CONTROLLER
export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    // NOS LLEVAMOS LA LOGICA DE VER SI EXITE UN PROUECTO AL MIDDLEWARE PROUYECT.TS EN LA CARPETA MIDDLEWARES

    try {
      // COMO LA RELACION ESD E UN PROYECTO TIENE MUCHAS TAREAS
      // ENCUERNTRO EL PROUYECTO
      // TOMO LA TAREA Y LA ASIGNO AL PROYECTO MEDIANTE TASK.PROJECT = PROJECT.ID
      // ASI LA RELACION ENTRE TAREA Y PROYECTO ESTA HECHA
      // PARA GUARDAR TAREAS EJN EL PROYECTO , TOMO EL PROUECTO ENCONTRADO CON EL ID
      // Y LE AGREGO LA TAREA AL ARRAY DE TAREAS DEL PROYECTO
      // ASI CUANDO CREE UNA TAREA SE ASIGNARA TAMBIEN AL ARREGLO DE TAREAS EN EL PROYECTO ENCONTRADO
      // project.tasks.push(task.id); Y project.save();
      const task = new Task(req.body);

      //TUVE QUE PONERLOS COMO REQ YA QUE DELCARE EN EL MIDDLEWAER PROUYECT.TS
      //   QUE HABRA UN OBJETO PROYECT EN EL REQUEST Y GLOBALMENTE
      task.project = req.project.id;

      console.log(req.project);

      req.project.tasks.push(task.id);

      // ALLSETTLED ME PERMITE EJECUTAR VARIAS PROMESAS AL MISMO TIEMPO Y ASEGURA QUE SE HAGAN
      Promise.allSettled([task.save(), req.project.save()]);
      res.send("tarea creada");
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getProjectsTasks = async (req: Request, res: Response) => {
    console.log("entro a getproject tasks");
    console.log("id de project", req.project.id);

    try {
      // TODO: POPULATE ME PERMITE TRAER LA INFORMACION DE LA RELACION
      // ESTO ME TRAE EN LA RESPUESTA ADEMAS EL PROYECTO AL QUE PERTENECE LA TAREA
      const tasks = await Task.find({
        project: req.project.id,
      }).populate("project");

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      // const { taskId } = req.params;
      // const task = await Task.findById(taskId);
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ error: error.message });
      // }

      // console.log(task.project);
      // console.log(req.project.id);

      // el project es la el campo que trae el task como proyecto, el id

      // se compara con el prouecto encontrado con el projectid en el middleware que es pasado a al req global
      //  // TODO: ESTO SE PASO A MIDDLEWARE
      // if (req.task.project.toString() != req.project.id) {
      //   const error = new Error("Acción no válida");
      //   return res.status(400).json({ error: error.message });
      // }

      // TODO: POPULATE PARA TRAER DATOS RELACIONADOS

      // EN ESTE CASO PARA TRAER EL ID DEL QUE COMPLETO UNA TAREA
      const task = await Task.findById(req.task.id)
        // AHORA EL POPPULATE SE APLICA EN EL USER AL PONER .USER
        .populate({ path: "completedBy.user", select: "id name email" })

        //TODO: SEGUNDO POPULATE PARA TRAER LAS NOTAS DE UNA TAREA
        // DONDE HAYA IDS RELACIONADOS PUEDO TRAERLOS CON POPULATE
        // Y DENTRO DEL POPULATE PUEDO PEDIR OTRO POPULATE PARA TRAER AL USUARIO
        .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}});

      console.log("task ->", task);

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static updateTask = async (req: Request, res: Response) => {
    try {
      // const { taskId } = req.params;
      // const task = await Task.findById(taskId);
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ error: error.message });
      // }

      // console.log(task.project);
      // console.log(req.project.id);

      // el project es la el campo que trae el task como proyecto, el id
      // se compara con el prouecto encontrado con el projectid en el middleware que es pasado a al req global
      // TODO: ESTO SE PASO A MIDDLEWARE
      // if (req.task.project.toString() != req.project.id) {
      //   const error = new Error("Acción no válida");
      //   return res.status(400).json({ error: error.message });
      // }

      req.task.name = req.body.name;
      req.task.description = req.body.description;

      await req.task.save();
      res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      // // tomo el taskid
      // const { taskId } = req.params;
      // // busco la tarea por el id
      // const task = await Task.findById(taskId);

      // // si no existe la tarea
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ error: error.message });
      // }

      // las tareas en el request se filtran y asi elimino, devuelve o deja todas las que sean distitnas al id que viene en
      // el paramtro quean distintos al id de la tarea
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.taskId
      );

      await Promise.allSettled([req.project.save(), req.task.deleteOne()]);
      res.send("Tarea eliminada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      // const { taskId } = req.params;
      // // si no existe la tarea
      // const task = await Task.findById(taskId);
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ error: error.message });
      // }

      const { status } = req.body;

      req.task.status = status;

      const data = {
        user: req.user.id,
        status: req.task.status,
      };

      // TODO: CAMPO NUEVO EN EL MODELO TASK
      // SABER QUIEN COMPLETO LA TAREA
      // como el campo es un arreglo vamos pusheando los datos
      req.task.completedBy.push(data);
      await req.task.save();

      res.send("status de tarea actualizado");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
