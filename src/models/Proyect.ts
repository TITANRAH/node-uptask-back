import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

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

const Project = mongoose.model<IProject>("Project", ProyectSchema);
export default Project;
