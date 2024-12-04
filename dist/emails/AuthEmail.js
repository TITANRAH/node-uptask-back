"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
// TODO: NODEMAILER 2
// CREAMOS UNA CLASE PARA QUE PUEDA ENVIARSE EL CORREO
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: "UpTask",
            to: user.email,
            subject: "UpTask - Confirma tu cuenta",
            text: "UpTask - Confirma tu cuenta",
            html: `<p>Hola: ${user.name} Has creado tu cuenta en UpTask, ya casi esta todo listo , solo debes confirmar tu cuenta</p>` +
                `<a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta</a>` +
                `<p>E ingresa el siguiente código: <b>${user.token}</b> </p>` +
                `<p>Si no has creado una cuenta, ignora este mensaje</p>` +
                `<p><b>Este token expira en 10 min</b> </p>`,
        });
        console.log("Email enviado", info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: "UpTask",
            to: user.email,
            subject: "UpTask - Reestablece tu password",
            text: "UpTask - Reestablece tu password",
            html: `<p>Hola: ${user.name} Has has solicitado reestablecer tu password</p>` +
                `<a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer password</a>` +
                `<p>E ingresa el siguiente código: <b>${user.token}</b> </p>` +
                `<p>Si no has creado una cuenta, ignora este mensaje</p>` +
                `<p><b>Este token expira en 10 min</b> </p>`,
        });
        console.log("Email enviado", info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map