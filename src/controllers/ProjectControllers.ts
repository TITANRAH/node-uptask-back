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
        $or: [
          // TODO: PUEDO VER LOS PROYECTOS AL LOGUEARME SOLO SI SOY
          // MANAGER O PERTENEZCO A UN TEAM
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });

      console.log("projects", projects);

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
      // Y SI NO PERTENEZCO A UN TEAM DARA ESTE ERROR SI NO NO, Y DEJHARA VER EL PROYECTO
      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Acción no autorizada");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static udpateProyect = async (req: Request, res: Response) => {
    try {
      req.project.clientName = req.body.clientName;
      req.project.projectName = req.body.projectName;
      req.project.description = req.body.description;

      await req.project.save();
      res.send("proyecto actualizado");
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProyect = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    try {
      await req.project.deleteOne();

      res.send("proyecto eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
