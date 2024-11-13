import mongoose, { Schema, Document, Types } from "mongoose";


// TODO: DICCIONARIO DE ESTADOS DE TAREAS
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed',
} as const

//TODO: ASI DIGO QUE TASK STATUS SOLO ACEPTE VALORES DE TASKSTATUS
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
  name: string;
  description: string;
  // TODO: RELACIONES
  // CADA TAREA TIENE UN PROYECTO Y SERA ASOCIADO MEDIANTE EL OBJECT ID
  project: Types.ObjectId;
  status: TaskStatus;
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
        default: taskStatus.PENDING
    }
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Tasks", TaskSchema);
export default Task;
