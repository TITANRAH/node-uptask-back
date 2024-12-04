"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskExist = taskExist;
exports.taskBelongsToProject = taskBelongsToProject;
exports.hasAuthorization = hasAuthorization;
const Task_1 = __importDefault(require("../models/Task"));
async function taskExist(req, res, next) {
    try {
        const { taskId } = req.params;
        console.log(taskId);
        // ENCUENTRO LA TAREA SI LA ENCUENTRA SERA EL ID DE ESA TAREA QUE SE PASE EN EL ID DEL PROUECTO EN EL OBJETO TASK
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            const error = new Error("Tarea no encontrada");
            return res.status(404).json({ error: error.message });
        }
        // HAY QUE DECLARAR UN GLOBAL REQUEST COMO ARRIBA Y EN ESTE CASO
        // UNA VEZ DECLARADO Y COMO UN MIDDLEWARE SE EJECTUA ANTES DE CUALQUIER COSA
        // DECIMOS QUE EL PROJECT DECLARADO EN LA INTERFACE DE REQUEST ES IGUAL AL PROJECT ENCONTRADO
        // ESTO HACE QUE PROJECT ESTE DISPONIBLE EN CUALQUIER LADO DEL REQUEST O DE LA APP
        // POR LOQ UE PUEDO LEERLO EN EL CONTROLADOR QUE NECESITE
        req.task = task;
        // SI EL PROYECTO NO EXISTE RETORNA UN ERROR
        // Y SI EXISTE CONTINUA CON LA SIGUIENTE FUNCION CON NEXT
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}
function taskBelongsToProject(req, res, next) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(400).json({ error: error.message });
    }
    next();
}
function hasAuthorization(req, res, next) {
    // console.log('manager -> ',req.project.manager.toString())
    // console.log('user ->',req.user.id.toString)
    console.log(req.user.id.toString() === req.project.manager.toString());
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error("Acción no válida");
        return res.status(400).json({ error: error.message });
    }
    next();
}
//# sourceMappingURL=task.js.map