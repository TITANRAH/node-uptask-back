"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Proyect_1 = __importDefault(require("../models/Proyect"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        //    extraemos el email del body
        const { email } = req.body;
        // buscamos al usuario por email
        // TODO: USAR SIEMPRE COMO OBJETO EN FINDEONE
        const user = await User_1.default.findOne({ email }).select("name email id");
        if (!user) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json({ message: error.message });
        }
        res.json(user);
    };
    static addMemberById = async (req, res) => {
        const { id } = req.body;
        console.log(id);
        const user = await User_1.default.findById(id).select("id");
        if (!user) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json({ message: error.message });
        }
        //CONDICION PARA EVITAR DUPLICADOS
        if (req.project.team.some((teamMember) => teamMember.toString() === user.id.toString())) {
            const error = new Error("Usuario ya agregado");
            return res.status(409).json({ message: error.message });
        }
        // TODO: AGREGAR USUARIOS AL PROYECTO
        // COMO TEAM ES UN ARRAY DE USUARIOS PODEMOS HACER PUSH
        req.project.team.push(user.id);
        //TODO: EVITAR DUPLICADOS EN EL TEAM DE PROYECTOS
        // GUARDAMOS EL PROYECTO
        await req.project.save();
        res.send("Usuario agregado correctamente");
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        console.log(userId);
        if (!req.project.team.some((teamMember) => teamMember.toString() === userId)) {
            const error = new Error("El proyecto no tiene a este usuario");
            return res.status(409).json({ message: error.message });
        }
        try {
            req.project.team = req.project.team.filter((teamMember) => teamMember.toString() !== userId.toString());
            req.project.save();
            return res.send("Usuario eliminado correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static getProyectTeam = async (req, res) => {
        // tomo el proyecto del req que esta en el middleware
        // le digo que traiga team con populate a traves del path
        // y le digo que solo me traiga nombre email id
        const project = await Proyect_1.default.findById(req.project.id).populate({
            path: "team",
            select: "name email id",
        });
        if (!project) {
            const error = new Error("Proyecto no encontrado");
            return res.status(404).json({ message: error.message });
        }
        res.json(project.team);
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map