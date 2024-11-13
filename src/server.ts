import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// TODO: EXPORTAMOS LAS RUTAS Y LAS IMPRTAMOS ACA AL SERVIDOR
import projectRoutes from "./routes/projectRoutes";

//TODO: DOTENV
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//TODO: ROUTES

// ACA DEFINIMOS UNA RUTA BASE Y LUEGO LAS RUTAS DE LOS ENDPOINTS ENE STE CASO
// PROJECTROUTES ES / ENTONCES EL ENDPOINT QIEDARIA ASI /api/projects

// app.use("/api/auth")
app.use("/api/projects", projectRoutes);

export default app;
