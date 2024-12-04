"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const colors_1 = __importDefault(require("colors"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_process_1 = require("node:process");
const connectDB = async () => {
    try {
        //TODO: MONGOOSE CONNECTION
        const { connection } = await mongoose_1.default.connect(process.env.DATABASE_URL);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors_1.default.magenta.bold(`Conectado a la base de datos en ${url}`));
    }
    catch (error) {
        console.log("Error al conectar a la bd ");
        // TODO: process.exit(1) pero es para terminar es como un finally si ponemos un 0 todo salio bien si klelva unn 1 indica error
        // puede ser asi o llamar solo a exit
        //    process.exit(1)
        (0, node_process_1.exit)(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map