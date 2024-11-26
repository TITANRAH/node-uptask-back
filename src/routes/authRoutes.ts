// TODO: CREAR NUEVO SCHEMA PASO 2 Crear un archivo de ruta solo para Auth o user

import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";


//TODO: ENDPOINTS AUTH
const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El pass es muy corto, min 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
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
  }),
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede ir vacío"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email no válido"),
  body("password").notEmpty().withMessage("El pass no puede ir vacío"),
  handleInputErrors,
  AuthController.login
);

export default router;
