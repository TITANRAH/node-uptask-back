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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// TODO: MIDDLEWARE QUE VERIFICA SI EN LOS HEADERS VIENE EL TOKEN
// PODEMOS USARLA EN CUALQIER RUTA QUE QUIERAMOS QIE ESTO VERIFIQUE EL TOKEN
const authenticate = async (req, res, next) => {
    // TOMAMOS EL TOKEN
    const bearer = req.headers.authorization;
    //   SI NO VIENE EL TOKEN DEVUELVE ERROR
    if (!bearer) {
        const error = new Error("No autorizado");
        return res.status(401).json({ error: error.message });
    }
    // SI VIENE EL TOKEN LO SEPARAMOS
    const token = bearer.split(" ")[1];
    try {
        // VERIFICAMOS EL TOKEN PARA SABER SI ES VALIDO Y NO HA EXPIRADO
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // DEL DECODEDE TOMAMOS EL DATO QUE GUARDAMOS EN EL JWT QUE ES EL ID DE USUARIO
        // Y BUSCAMOS EL USUARIO EN LA BASE DE DATOS SI EXISTE
        if (typeof decoded === "object" && decoded.id) {
            const user = await User_1.default.findById(decoded.id).select('_id name email');
            //   console.log("user ", user);
            if (user) {
                // SI EL USUARIO EXISTE DECLARAMOS UN GLOBAL AL IGUAL QUE CON PROJECT Y LO GUARDAMOS EN EL REQUEST GLOBAL
                req.user = user;
                next();
            }
            else {
                res.status(500).json({ error: "Token no válido" });
            }
        }
    }
    catch (error) {
        console.log("error", error);
        if (jsonwebtoken_1.TokenExpiredError) {
            const error = new Error("Token expirado");
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: "Token no válido" });
    }
    // console.log('token', token);
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map