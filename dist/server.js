"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
// TODO: CORS 3
// AQUI LLAMAMOS A LOS CORS Y LA CONFIG QUE HICIMOS
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
// TODO: EXPORTAMOS LAS RUTAS Y LAS IMPRTAMOS ACA AL SERVIDOR
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
// TODO: CREAR NUEVO SCHEMA PASO 3 IMPORTAMOS LAS RUTAS DE AUTH
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const morgan_1 = __importDefault(require("morgan"));
//TODO: DOTENV
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// TODO: CORS 4
// AQUI USAMOS LA CONFIGURACION DE CORS
app.use((0, cors_1.default)(cors_2.corsConfig));
//VER LOGS DE LAS PETICIONES
app.use((0, morgan_1.default)('dev'));
// LEER DATOS DE FORMULARIOS
app.use(express_1.default.json());
//TODO: ROUTES
// ACA DEFINIMOS UNA RUTA BASE Y LUEGO LAS RUTAS DE LOS ENDPOINTS ENE STE CASO
// PROJECTROUTES ES / ENTONCES EL ENDPOINT QIEDARIA ASI /api/projects
// app.use("/api/auth")
app.use("/api/auth", authRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map