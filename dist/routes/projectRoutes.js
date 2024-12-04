"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectControllers_1 = require("../controllers/ProjectControllers");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const TaskControllers_1 = require("../controllers/TaskControllers");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
//TODO EVIATAR ESCRIBIR EL MIDDELWARE EN TODOS LOS ENDPOINT
// ASI LOS PROTEJO TODOS DE UNA
router.use(auth_1.authenticate);
router.post(
//TODO: VALIDACIONES FUNCIONAN COMO ZOD
"/", 
//TODO: MIDDLEWARE DE AUTORIZACION CON JWT
(0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La descripción del proyecto es obligatorio"), 
//MIDDLEWARE REUTILIZABLE
validation_1.handleInputErrors, ProjectControllers_1.ProjectController.createProject);
router.get("/", ProjectControllers_1.ProjectController.getAllProjects);
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, ProjectControllers_1.ProjectController.getProjectById);
// esto valida que el prouecto exista antes de hacer cualquier cosa
router.param("projectId", project_1.projectExist);
// TODO: MIDDLEWARE PAR SABER SI UN PROYECTO EXISTE 
// CAMBIAMOS DE ID A PROJECT ID Y SUBIMOS EL MIDDLEWARE DE POSICION
// AHORA QUE SE LLAME PROJECTID ENTRARA A FUNCIONAR CON EL MIDDLEWARE
router.put("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("No es un id válido"), (0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La descripción del proyecto es obligatorio"), 
//MIDDLEWARE REUTILIZABLE
validation_1.handleInputErrors, task_1.hasAuthorization, ProjectControllers_1.ProjectController.udpateProyect);
router.delete("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectControllers_1.ProjectController.deleteProyect);
//TODO: ROUTE FOR TASKS
// la create task pide el id del proyecto  slash tasks
router.post("/:projectId/tasks", task_1.hasAuthorization, (0, express_validator_1.param)("projectId").isMongoId().withMessage("No es un id válido"), (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"), (0, express_validator_1.body)("description").notEmpty().withMessage("La descripcion es obligatoria"), 
//TODO: MIDDLEWARE PARA VER SI EXISTE UN PROYECTO ESTOS SE EJECUTAN ANTES QUE TODO
validation_1.handleInputErrors, TaskControllers_1.TaskController.createTask);
router.get("/:projectId/tasks", (0, express_validator_1.param)("projectId").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, TaskControllers_1.TaskController.getProjectsTasks);
//TODO: MIDDLEWARE COMPROBACION DE QUE LA TAREA EXISTA
router.param("taskId", task_1.taskExist);
router.param("taskId", task_1.taskBelongsToProject);
router.get("/:projectId/tasks/:taskId", (0, express_validator_1.param)("taskId").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, TaskControllers_1.TaskController.getTaskById);
router.put("/:projectId/tasks/:taskId", 
// NECESITAS SER MANAGER PARA PODER EDITAR
task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("No es un id válido"), (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"), (0, express_validator_1.body)("description").notEmpty().withMessage("La descripcion es obligatoria"), validation_1.handleInputErrors, TaskControllers_1.TaskController.updateTask);
router.delete("/:projectId/tasks/:taskId", 
//NECESITAS SER MANAGER PARA PODER ELIMINAR
task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, TaskControllers_1.TaskController.deleteTask);
router.post("/:projectId/tasks/:taskId/status", (0, express_validator_1.param)("taskId").isMongoId().withMessage("No es un id válido"), (0, express_validator_1.body)("status").notEmpty().withMessage("El status es obligatorio"), validation_1.handleInputErrors, TaskControllers_1.TaskController.updateTaskStatus);
// TEAMS
router.post("/:projectId/team/find", (0, express_validator_1.body)("email").isEmail().toLowerCase().withMessage("Email no válido"), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
router.post("/:projectId/team", (0, express_validator_1.body)("id").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete("/:projectId/team/:userId", (0, express_validator_1.param)("userId").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberById);
router.get("/:projectId/team", validation_1.handleInputErrors, TeamController_1.TeamMemberController.getProyectTeam);
// NOTES ROUTES
router.post("/:projectId/tasks/:taskId/notes", (0, express_validator_1.body)("content")
    .notEmpty()
    .withMessage("El contenido de la nota es obligatorio"), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get("/:projectId/tasks/:taskId/notes", NoteController_1.NoteController.getTaskNotes);
router.delete("/:projectId/tasks/:taskId/notes/:noteId", (0, express_validator_1.param)("noteId").isMongoId().withMessage("No es un id válido"), validation_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map