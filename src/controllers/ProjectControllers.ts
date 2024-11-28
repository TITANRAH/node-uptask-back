// TODO: Request Response import
import type { Request, Response } from "express";
import Project from "../models/Proyect";

// TODO: CONTROLLER
export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    console.log(req.body);
    const project = new Project(req.body);

    project.manager = req.user.id;

    // TODO: PARA PROBAR EL TOAST DE ERROR
    // if(true){
    //   const error = new Error("Proyecto no encontrado");
    //   return res.status(400).json({ error: error.message });
    // }

    console.log("req.user", req.user);
    try {
      console.log("project", project);
      await project.save();
      res.send("proyecto creado");
    } catch (error) {
      console.log(error);
    }
  };

  //TODO: OBTENER TODOS LOS PROYECTOS PERO DEL USUARIO QUE ESTE AUTENTICADO
  // YA QUE GUARDAMOS N UN MIDDLEWARE EL USUARIO EN EL REQUEST
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user.id } }],
      });
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    try {
      const project = await Project.findById(id).populate("tasks");

      if (!project) {
        console.log("emntro aca no hay proyecto");

        const error = new Error("proyecto no encontrado");
        return res.status(404).json({ error: error.message });
        }

        //TODO: AUTENTICACION AUTROIZACION EN GETPROJECTBYID
      // AQUI YA TENEMOS UN PROYECTO ENCOTRADO POR ID DE PROUYECTO 
      // AHORA ESTE PROYECTO TRAE UN MANAGER QUE ES QUIEN CREO ESTE PROUECTO 
      // Y ESTE MANAGER ES UN ID DE USUARIO

      // COMO TENEMOS AL USUARIO EN EL REQUEST GRACIAS AL MIDDELWARE 
      // PODEMOS COMPARAR SI EL MANAGER DEL PROUECTO ES EL MISMO AL USUARUIO AUTENTICADO 
      // POR ESO SI ME AUTENTICO CON EL DUEÑO DEL PROYECTO PUEDO VER EL PROYECTO QUE VA EN EL PARAM 
      // SI NO SOY EL DUEÑO DEL PROYECTO NO PUEDO VERLO AUNQUE ME AUTENTIQUE CON OTRO USUARIO
      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Acción no autorizada");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static udpateProyect = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    try {
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error("proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Solo el manager puede actualizar este proyecto");
        return res.status(404).json({ error: error.message });
      }
      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();
      res.send("proyecto actualizado");
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProyect = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    try {
      // PUEDE SER ASI
      // const project = await Project.findByIdAndDelete(id, req.body);

      // O ASI

      const project = await Project.findById(id);
      if (!project) {
        const error = new Error("proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Solo el manager puede eliminar este proyecto");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();

      res.send("proyecto eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
