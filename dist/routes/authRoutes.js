"use strict";
// TODO: CREAR NUEVO SCHEMA PASO 2 Crear un archivo de ruta solo para Auth o user
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
//TODO: ENDPOINTS AUTH
const router = (0, express_1.Router)();
router.post("/create-account", (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre es obligatorio"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("El pass es muy corto, min 8 caracteres"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    // TODO: CUSTOM Validator
    // PODEMOS TENER ACCESO A REQ POR LO QUE A REQ.BODY.PASSWORD QUE ES EL PASSWORD QUE VIENE FEL BODY
    //  Y VALUE ES LO QUE EL USUARIO INGRESO
    // Y REQ.BODY.PASSWORD LO QUE EL USUARIO TAMBIEN INGRESO
    // POR LO QUE CON CUSTOM PODEMOS TOMAR UN VALOR INGRESADO COMO
    // PASSWORD_CONFIRMATIO Y COMPRARLO CON CUALQUIER OTRO A TRAVES DEL REQUEST EN ESTE CASO CON PASSWORD
    // ASI SSABREMOS SI SON IGUALES O NO
    // console.log(value)
    // console.log(req.body.password)
    if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
    }
    // si pasa la validacion continuara al ver el true
    return true;
}), (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, AuthController_1.AuthController.createAccount);
router.post("/confirm-account", (0, express_validator_1.body)("token").notEmpty().withMessage("El token no puede ir vacío"), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), (0, express_validator_1.body)("password").notEmpty().withMessage("El pass no puede ir vacío"), validation_1.handleInputErrors, AuthController_1.AuthController.login);
router.post("/request-code", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, AuthController_1.AuthController.requestConfirmationCode);
// TODO: FORGOT PASSWORD BACKEND 1
router.post("/forgot-password", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
// TODO: FORGOT PASSWORD BACKEND 2
// TODO: REVISION DE TOKEN SI EXISTE PARA CAMBIAR CONTRASEÑA
router.post("/validate-token", (0, express_validator_1.body)("token").notEmpty().withMessage("El token no puede ir vacío"), validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
// TODO: FORGOT PASSWORD BACKEND 3
// COMPARACION DE PASSWORDS NUEVOS
router.post("/update-password/:token", (0, express_validator_1.param)("token").isNumeric().withMessage("El token no es válido"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("El pass es muy corto, min 8 caracteres"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    // TODO: CUSTOM Validator
    // PODEMOS TENER ACCESO A REQ POR LO QUE A REQ.BODY.PASSWORD QUE ES EL PASSWORD QUE VIENE FEL BODY
    //  Y VALUE ES LO QUE EL USUARIO INGRESO
    // Y REQ.BODY.PASSWORD LO QUE EL USUARIO TAMBIEN INGRESO
    // POR LO QUE CON CUSTOM PODEMOS TOMAR UN VALOR INGRESADO COMO
    // PASSWORD_CONFIRMATIO Y COMPRARLO CON CUALQUIER OTRO A TRAVES DEL REQUEST EN ESTE CASO CON PASSWORD
    // ASI SSABREMOS SI SON IGUALES O NO
    // console.log(value)
    // console.log(req.body.password)
    if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
    }
    // si pasa la validacion continuara al ver el true
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updatePasswordWithToken);
// TODO: ENDPOINT PARA VERIFICAR SI EL USUARIOE STA AUTENTICADO
router.get("/user", auth_1.authenticate, AuthController_1.AuthController.user);
router.put("/profile", auth_1.authenticate, (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre es obligatorio"), (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, AuthController_1.AuthController.updateProfile);
router.post("/update-password", auth_1.authenticate, (0, express_validator_1.body)("current_password")
    .notEmpty()
    .withMessage("La contraseña actual es obligatoria"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("El pass es muy corto, min 8 caracteres"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurrentUserPassword);
router.post("/check-password", auth_1.authenticate, (0, express_validator_1.body)("password").notEmpty().withMessage("El pass no puede ir vacío"), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map