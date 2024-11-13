// TODO: Request Response import
import type { Request, Response } from "express";
import Project from "../models/Proyect";

// TODO: CONTROLLER
export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    console.log(req.body);
    const project = new Project(req.body);

    try {
      await project.save();
      res.send("proyecto creado");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
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
      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();
      res.json({
        message: "proyecto actualizado",
        project,
      });
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

      await project.deleteOne();

      res.send("proyecto eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
