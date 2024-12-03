import mongoose, { Schema, Document, Types } from "mongoose";

// TODO: DICCIONARIO DE ESTADOS DE TAREAS

// TODO: NOTE 3
const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;

//TODO: ASI DIGO QUE TASK STATUS SOLO ACEPTE VALORES DE TASKSTATUS
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  // TODO: RELACIONES
  // CADA TAREA TIENE UN PROYECTO Y SERA ASOCIADO MEDIANTE EL OBJECT ID
  project: Types.ObjectId;
  status: TaskStatus;
  // TODO: AGRGAR UN ARREGLO DE USUARIOS QUE COMPLETARON LA TAREA
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  // 1. agegamos un arreglo de notas a la interface
  notes: Types.ObjectId[];
}

export const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      // TODO: RELACIONES
      // con esto cada tarea tendra informacion al proyecto al cual pertenece
      type: Types.ObjectId,
      // ACA RECIBE EL NOMBRE DEL MODELO ESTE NOMBRE SE
      // PONE ENTRE PARENTESIS COMO ACA ABAJO EN EL EXPORT EL NOMBRE TASK
      ref: "Project",
    },
    //TODO: AQUI PASAMOS EL STATUS FINALME
    // SERA DE TIPO STRING Y SOLO ACEPTARA LOS VALORES DE TASKSTATUS
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    // TODO: CAMPO NUEVO
    // SABER QUIEN COMPLETO LA TAREA
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],

    // 2. agegamos un arreglo de notas a la tarea
    notes: [
      // 3. agegamos un arreglo de notas a la tarea y asi referenciamos  a
      // la coleccion de notas

      // 4. volvemos al controlador NoteCopntroller para agregar las notas a la tarea
      {
        type: Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Tasks", TaskSchema);
export default Task;
