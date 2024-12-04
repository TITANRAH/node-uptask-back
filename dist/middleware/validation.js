"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputErrors = void 0;
const express_validator_1 = require("express-validator");
//TODO: MIDDLWEARE DE ERRORES
const handleInputErrors = (req, res, next) => {
    // SI EL REQUEST TRAE ERRORES GUARDALOS EHN LA VARIABLE ERRORS
    // SI NO HAY ERRORES CONTINUA CON LA SIGUIENTE FUNCION 
    // OSEA EN ESTE CASO AL CONTROLADOR
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleInputErrors = handleInputErrors;
//# sourceMappingURL=validation.js.map