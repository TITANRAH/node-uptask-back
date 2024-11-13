import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";

// TODO: INTERFACE TYPE MONGO
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  // ASI TERMINO DE DEFINIR LA RELACION DE UN PROYECTO CON SUS TAREAS 1 A MUCHOS
  tasks: PopulatedDoc<ITask & Document>[];
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
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>("Project", ProyectSchema);
export default Project;
