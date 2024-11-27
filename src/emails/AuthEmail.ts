import { transporter } from "../config/nodemailer";
import { IToken } from "../models/Token";
import { IUser } from "../models/User";

interface IEmail {
  email: IUser["email"];
  name: IUser["name"];
  token: IToken["token"];
}

// TODO: NODEMAILER 2

// CREAMOS UNA CLASE PARA QUE PUEDA ENVIARSE EL CORREO
export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "UpTask",
      to: user.email,
      subject: "UpTask - Confirma tu cuenta",
      text: "UpTask - Confirma tu cuenta",
      html:
        `<p>Hola: ${user.name} Has creado tu cuenta en UpTask, ya casi esta todo listo , solo debes confirmar tu cuenta</p>` +
        `<a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta</a>` +
        `<p>E ingresa el siguiente código: <b>${user.token}</b> </p>` +
        `<p>Si no has creado una cuenta, ignora este mensaje</p>` +
        `<p><b>Este token expira en 10 min</b> </p>`,
    });

    console.log("Email enviado", info.messageId);
  };
}
