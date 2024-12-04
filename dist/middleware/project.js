"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectExist = projectExist;
const Proyect_1 = __importDefault(require("../models/Proyect"));
async function projectExist(req, res, next) {
    try {
        const { projectId } = req.params;
        console.log(projectId);
        // ENCUENTRO LA TAREA SI LA ENCUENTRA SERA EL ID DE ESA TAREA QUE SE PASE EN EL ID DEL PROUECTO EN EL OBJETO TASK
        const project = await Proyect_1.default.findById(projectId);
        if (!project) {
            const error = new Error("proyecto no encontrado");
            return res.status(404).json({ error: error.message });
        }
        // HAY QUE DECLARAR UN GLOBAL REQUEST COMO ARRIBA Y EN ESTE CASO
        // UNA VEZ DECLARADO Y COMO UN MIDDLEWARE SE EJECTUA ANTES DE CUALQUIER COSA
        // DECIMOS QUE EL PROJECT DECLARADO EN LA INTERFACE DE REQUEST ES IGUAL AL PROJECT ENCONTRADO
        // ESTO HACE QUE PROJECT ESTE DISPONIBLE EN CUALQUIER LADO DEL REQUEST O DE LA APP
        // POR LOQ UE PUEDO LEERLO EN EL CONTROLADOR QUE NECESITE
        req.project = project;
        // SI EL PROYECTO NO EXISTE RETORNA UN ERROR
        // Y SI EXISTE CONTINUA CON LA SIGUIENTE FUNCION CON NEXT
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}
//# sourceMappingURL=project.js.map