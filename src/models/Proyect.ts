import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

// TODO: INTERFACE TYPE MONGO
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  // ASI TERMINO DE DEFINIR LA RELACION DE UN PROYECTO CON SUS TAREAS 1 A MUCHOS
  tasks: PopulatedDoc<ITask & Document>[];
  manager: PopulatedDoc<IUser & Document>
  team: PopulatedDoc<IUser & Document>[]
}

const ProyectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Tasks",
      },
    ],
    // AGREGAMOS A QUIEN CREO EL PROUECTO FACILMENTE DECLARANDOLO 
    // EN LA INTERFACE Y AQUI EN EL SCHEMA
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
  // AGREGAMOS A QUIEN CREO EL PROUECTO FACILMENTE DECLARANDOLO 
    // EN LA INTERFACE Y AQUI EN EL SCHEMA
    team: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);


ProyectSchema.pre(
  "deleteOne",
 
  { document: true },
  async function () {
   
    // 1. Eliminamos un proyecto y lo recuperamos de this._id 
    const projectId = this._id;
    if (!projectId) return;
    
    // 2. Buscamos todas las tareas que pertenecen a ese proyecto
    const tasks = await Task.find({project:projectId})

    // iterams sobre cada tarea
    for(const task of tasks){
      // 3. eliminamos cada tarea iterada
      await Note.deleteMany({ task: task._id });
    }

    await Task.deleteMany({ project: projectId });
  }
);

const Project = mongoose.model<IProject>("Project", ProyectSchema);
export default Project;
