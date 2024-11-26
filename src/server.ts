import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
// TODO: CORS 3
// AQUI LLAMAMOS A LOS CORS Y LA CONFIG QUE HICIMOS
import cors from "cors";
import { corsConfig } from "./config/cors";
// TODO: EXPORTAMOS LAS RUTAS Y LAS IMPRTAMOS ACA AL SERVIDOR
import projectRoutes from "./routes/projectRoutes";

// TODO: CREAR NUEVO SCHEMA PASO 3 IMPORTAMOS LAS RUTAS DE AUTH
import authRoutes from "./routes/authRoutes";
import morgan from "morgan";


//TODO: DOTENV
dotenv.config();
connectDB();

const app = express();
// TODO: CORS 4
// AQUI USAMOS LA CONFIGURACION DE CORS
app.use(cors(corsConfig));

//VER LOGS DE LAS PETICIONES
app.use(morgan('dev'))

// LEER DATOS DE FORMULARIOS
app.use(express.json());


//TODO: ROUTES

// ACA DEFINIMOS UNA RUTA BASE Y LUEGO LAS RUTAS DE LOS ENDPOINTS ENE STE CASO
// PROJECTROUTES ES / ENTONCES EL ENDPOINT QIEDARIA ASI /api/projects

// app.use("/api/auth")
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
