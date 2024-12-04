"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
// TODO: CORS 1
// AQUI PONDREMOS LAS URLS BASES PERMITIDAS PARA LA CONEXION
exports.corsConfig = {
    origin: function (origin, callback) {
        console.log(process.argv);
        const whitelist = [process.env.FRONTEND_URL];
        // TODO: CORS EN POSTMAN 2 
        // COMO CREE UN NUEVO SCRIPT EN EL PACKAGE.JSON PARA PODER USAR POSTMAN Y NO TENER QUE CAMBIAR EL ORIGIN CADA VEZ QUE CAMBIO DE ENTORNO
        // SI LOS ARGUMENTOS SON IGUALES A --API AGREGO UNA URL DE ORIGEN QUE NO EXISTE PARA QUE POSTMAN PUEDA HACER LAS PETICIONES
        if (process.argv[2] === '--api') {
            whitelist.push(undefined);
        }
        if (whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Error de CORS'));
        }
    }
};
//# sourceMappingURL=cors.js.map