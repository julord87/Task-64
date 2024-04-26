import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate)

/* ROUTES FOR PROJECTS */
router .post("/",

    body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty().withMessage("La descripción del proyecto es obligatoria"),
    handleInputErrors,

    ProjectController.createProject
)

router.get("/", ProjectController.getAllProjects)

router.get("/:id", 

    param("id").isMongoId().withMessage("El ID del proyecto no es valido"),
    handleInputErrors,

    ProjectController.getProjectById
)

router.put("/:id", 

    param("id").isMongoId().withMessage("El ID del proyecto no es valido"),
    body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty().withMessage("La descripción del proyecto es obligatoria"),
    handleInputErrors,

    ProjectController.updateProject
)

router.delete("/:id", 

    param("id").isMongoId().withMessage("El ID del proyecto no es valido"),
    handleInputErrors,

    ProjectController.deleteProject
)

/* ROUTES FOR TASKS */
router.param('projectId', projectExists)

router.post("/:projectId/tasks",

    param("projectId").isMongoId().withMessage("El ID del proyecto no es valido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la tarea es obligatoria"),
    handleInputErrors,
    
    TaskController.createTask
)

router.get("/:projectId/tasks",
    param("projectId").isMongoId().withMessage("El ID del proyecto no es valido"),
    handleInputErrors,

    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get("/:projectId/tasks/:taskId",
    param("projectId").isMongoId().withMessage("El ID del proyecto no es valido"),
    param("taskId").isMongoId().withMessage("El ID del proyecto no es valido"),
    handleInputErrors,

    TaskController.getTaskById
)

router.put("/:projectId/tasks/:taskId",
    param("projectId").isMongoId().withMessage("El ID del proyecto no es valido"),
    param("taskId").isMongoId().withMessage("El ID del proyecto no es valido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la tarea es obligatoria"),
    handleInputErrors,

    TaskController.updateTask
)

router.delete("/:projectId/tasks/:taskId",
    param("projectId").isMongoId().withMessage("El ID del proyecto no es valido"),
    param("taskId").isMongoId().withMessage("El ID del proyecto no es valido"),
    handleInputErrors,

    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status", 

    param("taskId").isMongoId().withMessage("El ID de la tarea no es valido"),
    body("status").notEmpty().withMessage("El estado de la tarea es obligatorio"),
    handleInputErrors,

    TaskController.updateStatus
)

/** Routes for teams */
router.post("/:projectId/team/find",
    body('email').isEmail().toLowerCase().withMessage("El correo no es valido"),
    handleInputErrors,

    TeamMemberController.findMemberByEmail
)

router.get("/:projectId/team",
    TeamMemberController.getProjectTeam
)

router.post("/:projectId/team",
    body('id').isMongoId().withMessage("El ID del usuario no es valido"),
    handleInputErrors,

    TeamMemberController.addMemberById
)

router.delete("/:projectId/team",
    body('id').isMongoId().withMessage("El ID del usuario no es valido"),
    handleInputErrors,

    TeamMemberController.removeMemberById
)



export default router

