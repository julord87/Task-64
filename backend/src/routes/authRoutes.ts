import { Router } from "express";
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post("/create-account",
    body('name').notEmpty().withMessage("El nombre es obligatorio"),
    body('email').notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("El correo no es valido"),
    body('password').notEmpty().isLength({min: 6}).withMessage("El password es obligatorio"),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no coinciden")
        }
        return true
    }),
    handleInputErrors,

    AuthController.createAccount
)

router.post("/confirm-account",
    body('token').notEmpty().withMessage("Token requerido"),
    handleInputErrors,

    AuthController.confirmAccount
)

router.post("/login",
    body('email').notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("El correo no es valido"),
    body('password').notEmpty().withMessage("El password es obligatorio"),
    handleInputErrors,

    AuthController.login
)

router.post("/request-code",
    body('email').notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("El correo no es valido"),
    handleInputErrors,

    AuthController.requestConfirmationCode
)

router.post("/forgot-password",
    body('email').notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("El correo no es valido"),
    handleInputErrors,

    AuthController.forgotPassword
)

router.post("/validate-token",
    body('token').notEmpty().withMessage("Token requerido"),
    handleInputErrors,

    AuthController.validateToken
)

router.post("/update-password/:token",
    param('token').isNumeric().withMessage("Token no valido"),
    body('password').isLength({min: 6}).withMessage("El password es muy corto"),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no coinciden")
        }
        return true
    }),
    handleInputErrors,

    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** Profile */
router.put('/profile', 
    authenticate,
    body('name').notEmpty().withMessage("El nombre es obligatorio"),
    body('email').notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("El correo no es valido"),
    handleInputErrors,

    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage("El password actual es obligatorio"),
    body('password').notEmpty().isLength({min: 6}).withMessage("El nuevo password es muy corto"),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no coinciden")
        }
        return true
    }),
    handleInputErrors,

    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage("El password no puede ir vacío"),
    handleInputErrors,

    AuthController.checkPassword
)

export default router