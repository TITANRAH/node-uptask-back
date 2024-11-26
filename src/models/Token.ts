// TODO: CREAR NUEVO SCHEMA PASO 1 Crear el modelo de usuario

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createdAt: Date;
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    // TODO: REFERENCIA A OTRO SCHEMA
    // PRIMERO LO DECLARAMOS EN LA INTERFACE KLUEGO LO LLAMAMOS
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),

    //EXPIRACION DEL TOKEN
    expires: '10m',
  },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
