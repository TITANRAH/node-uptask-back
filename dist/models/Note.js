"use strict";
// TODO: NOTE 1
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
Object.defineProperty(exports, "__esModule", { value: true });
// 1. importar mongoose document schema types
// 2. crear interface INote extends Document
// 3. crear const NoteSchema: Schema
// 4. crear const Note = mongoose.model<INote>("Note", NoteSchema)
const mongoose_1 = __importStar(require("mongoose"));
// 8. creamos el esquema de la nota
const NoteSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    task: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
}, {
    // 9. el timestap es para que mongoose cree automaticamente los campos de fecha de creacion y actualizacion
    timestamps: true,
});
const Note = mongoose_1.default.model("Note", NoteSchema);
exports.default = Note;
// 10. agora pasaramos a la creacion de rutas y controladores
//# sourceMappingURL=Note.js.map