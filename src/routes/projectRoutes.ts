import { Router } from "express";
import { ProjectController } from "../controllers/ProjectControllers";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskControllers";
import { projectExist } from "../middleware/project";
import { taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

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

router.put(
  "/:id",
  param("id").isMongoId().withMessage("No es un id válido"),
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
  ProjectController.udpateProyect
);
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  ProjectController.deleteProyect
);

//TODO: ROUTE FOR TASKS
// la create task pide el id del proyecto  slash tasks

// esto valida que el prouecto exista antes de hacer cualquier cosa
router.param("projectId", projectExist);

router.post(
  "/:projectId/tasks",
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
  param("taskId").isMongoId().withMessage("No es un id válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
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
  "/:projectId/team",
  body("id").isMongoId().withMessage("No es un id válido"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);
router.get(
  "/:projectId/team",
  handleInputErrors,
  TeamMemberController.getProyectTeam
);

export default router;
