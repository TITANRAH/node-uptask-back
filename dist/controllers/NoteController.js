"use strict";
// TODO: NOTE 2
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
// 3. creamos la clase NoteController con un metodo estatico createNote
// 4.creamos la funcion createNote que recibe un request y un response
class NoteController {
    // podemos tipar el request , el primer parametro es el tipo de la request, el segundo el tipo de la respuesta y el tercero el tipo de la nota y hay un cuarto
    // que es el tipo de la respuesta que se espera
    static createNote = async (req, res) => {
        // 5. creamos una constante content que extraemos del cuerpo de la peticion
        const { content } = req.body;
        // 6. creamos una nueva instancia de Note
        const note = new Note_1.default();
        // 7. asignamos el contenido de la nota
        note.content = content;
        // 8. asignamos el usuario que creo la nota y este viene del middleware
        note.createdBy = req.user.id;
        // 9. asignamos la tarea a la que pertenece la nota y tambien viene del req del midleware
        note.task = req.params.taskId;
        // 10. guardamos las notas en la tarea
        req.task.notes.push(note.id);
        try {
            // 11. guardamos la nota y la tarea
            await Promise.allSettled([note.save(), req.task.save()]);
            res.send("Nota creada correctamente");
        }
        catch (error) {
            req.status(500).json({ error: "Hubo un error" });
        }
        console.log("req.body create Note :>> ", content);
    };
    static getTaskNotes = async (req, res) => {
        try {
            const notes = await Note_1.default.find({
                task: req.task.id,
            });
            res.json(notes);
        }
        catch (error) {
            req.status(500).json({ error: "Hubo un error" });
        }
    };
    static deleteNote = async (req, res) => {
        const { noteId } = req.params;
        const note = await Note_1.default.findById(noteId);
        if (!note) {
            const error = new Error("Nota no encontrada");
            return res.status(404).json({ error: error.message });
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error("Solo el creador de la nota puede eliminarla");
            return res.status(404).json({ error: error.message });
        }
        // TODO: ELIMINAR REFRENCIA EN COLECCIONES DE TASKS
        req.task.notes = req.task.notes.filter((note) => note.toString() !== noteId.toString());
        try {
            // cuando ten go mas de un await mejor usar promisses
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send("Nota eliminada correctamente");
        }
        catch (error) {
            req.status(500).json({ error: "Hubo un error" });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map