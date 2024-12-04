"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Note_1 = __importDefault(require("./Note"));
// TODO: DICCIONARIO DE ESTADOS DE TAREAS
// TODO: NOTE 3
const taskStatus = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGRESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETED: "completed",
};
exports.TaskSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
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
                type: mongoose_1.Types.ObjectId,
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
            type: mongoose_1.Types.ObjectId,
            ref: "Note",
        },
    ],
}, {
    timestamps: true,
});
// TODO: MIDDLEWARE DE MONGOOSE
// SE PUEDEN EJECTUAR PREVIO A UN GUARDADO O ELIMINADO DE UN DOCUMENTO
// EN ESTE CASO NECESITAMOS ELIMINAR UNA NOTA SI UNA TAREA SE ELIMINA
// LAS ELIMINACIONES LAS ETAMOS HACEIUNDO CON DELETEONE POR LO QUE USAMOS DELETEONE DENTRO DEL PRE
exports.TaskSchema.pre("deleteOne", 
// no usaremos query pero se puede ocupar
// { document: true, query: false },
{ document: true }, async function () {
    // esto te muetra en este caso el id de lat area eliminada
    console.log("id tarea elinunada", this._id);
    const taskId = this._id;
    if (!taskId)
        return;
    await Note_1.default.deleteMany({ task: taskId });
});
const Task = mongoose_1.default.model("Tasks", exports.TaskSchema);
exports.default = Task;
//# sourceMappingURL=Task.js.map