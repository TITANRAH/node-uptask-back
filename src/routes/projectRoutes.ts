import { Router } from "express";
import { ProjectController } from "../controllers/ProjectControllers";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskControllers";
import { projectExist } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExist,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import Note from "../models/Note";
import { NoteController } from "../controllers/NoteController";

const router = Router();

//TODO EVIATAR ESCRIBIR EL MIDDELWARE EN TODOS LOS ENDPOINT

// ASI LOS PROTEJO TODOS DE UNA
router.use(authenticate);

router.post(
  //TODO: VALIDACIONES FUNCIONAN COMO ZOD
  "/",

  //TODO: MIDDLEWARE DE AUTORIZACION CON JWT

  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción del proyecto es obligatorio"),
  //MIDDLEWARE REUTILIZABLE
  handleInputErrors,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  ProjectController.getProjectById
);

// esto valida que el prouecto exista antes de hacer cualquier cosa
router.param("projectId", projectExist);

// TODO: MIDDLEWARE PAR SABER SI UN PROYECTO EXISTE 

// CAMBIAMOS DE ID A PROJECT ID Y SUBIMOS EL MIDDLEWARE DE POSICION
// AHORA QUE SE LLAME PROJECTID ENTRARA A FUNCIONAR CON EL MIDDLEWARE

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("No es un id válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción del proyecto es obligatorio"),
  //MIDDLEWARE REUTILIZABLE
  handleInputErrors,
  hasAuthorization,
  ProjectController.udpateProyect
);
router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProyect
);

//TODO: ROUTE FOR TASKS
// la create task pide el id del proyecto  slash tasks



router.post(
  "/:projectId/tasks",
  hasAuthorization,
  param("projectId").isMongoId().withMessage("No es un id válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  //TODO: MIDDLEWARE PARA VER SI EXISTE UN PROYECTO ESTOS SE EJECUTAN ANTES QUE TODO
  handleInputErrors,
  TaskController.createTask
);

router.get(
  "/:projectId/tasks",
  param("projectId").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  TaskController.getProjectsTasks
);

//TODO: MIDDLEWARE COMPROBACION DE QUE LA TAREA EXISTA
router.param("taskId", taskExist);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  TaskController.getTaskById
);
router.put(
  "/:projectId/tasks/:taskId",
  // NECESITAS SER MANAGER PARA PODER EDITAR
  hasAuthorization,
  param("taskId").isMongoId().withMessage("No es un id válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  //NECESITAS SER MANAGER PARA PODER ELIMINAR
  hasAuthorization,
  param("taskId").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  TaskController.deleteTask
);
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("No es un id válido"),
  body("status").notEmpty().withMessage("El status es obligatorio"),
  handleInputErrors,
  TaskController.updateTaskStatus
);

// TEAMS
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email no válido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);
router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  TeamMemberController.addMemberById
);
router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);
router.get(
  "/:projectId/team",
  handleInputErrors,
  TeamMemberController.getProyectTeam
);

// NOTES ROUTES

router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota es obligatorio"),
  handleInputErrors,
  NoteController.createNote
);

router.get(
  "/:projectId/tasks/:taskId/notes",
  NoteController.getTaskNotes
);

router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  NoteController.deleteNote
);

export default router;
