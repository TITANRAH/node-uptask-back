// TODO: CREAR NUEVO SCHEMA PASO 1 Crear el modelo de usuario

import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    confirmed: boolean;

}


const userSchema: Schema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    //TODO: CAMPO AUTOMATICO FALSE
    // cuando no se p'one este campo en el body se crea automaticamente como falso en la bd
    confirmed: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model<IUser>('User', userSchema);
export default User;