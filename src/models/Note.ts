// TODO: NOTE 1

// 1. importar mongoose document schema types
// 2. crear interface INote extends Document
// 3. crear const NoteSchema: Schema
// 4. crear const Note = mongoose.model<INote>("Note", NoteSchema)

import mongoose, { Document, Schema, Types } from "mongoose";

export interface INote extends Document {
  // 5. declaramos los campos
  content: string;

  // 6. este campo es la referencia alusuario que creo la nota
  createdBy: Types.ObjectId;

  // 7. este campo es la referencia a la tarea a la que pertenece la nota
  // en este caso  y el de createdBy las referencias son los id de los documentos de la coleccion
  // y ese tupado en mongoose sedeclara asi Types.obkectid
  task: Types.ObjectId;
}

// 8. creamos el esquema de la nota
const NoteSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  {
    // 9. el timestap es para que mongoose cree automaticamente los campos de fecha de creacion y actualizacion
    timestamps: true,
  }
);

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;

// 10. agora pasaramos a la creacion de rutas y controladores