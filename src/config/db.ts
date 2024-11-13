import colors from "colors";
import mongoose from "mongoose";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    //TODO: MONGOOSE CONNECTION
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.magenta.bold(`Conectado a la base de datos en ${url}`));
  } catch (error) {
    console.log("Error al conectar a la bd ");
    // TODO: process.exit(1) pero es para terminar es como un finally si ponemos un 0 todo salio bien si klelva unn 1 indica error
    // puede ser asi o llamar solo a exit
    //    process.exit(1)
    exit(1);
  }
};
