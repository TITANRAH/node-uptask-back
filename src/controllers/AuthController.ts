import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transporter } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // prevenir duplicados
      const userExist = await User.findOne({ email });

      if (userExist) {
        const error = new Error("El usuario ya existe");
        return res.status(409).json({ error: error.message });
      }

      // crear un usuario
      const user = new User(req.body);

      // hashear password
      user.password = await hashPassword(password);

      // genear token

      const token = new Token();
      //   generatoken n o es una funcionasyncrona
      token.token = generateToken();

      // aqui guardamos la referencia del usuario en el token
      //   ya que token es una instancia nueva donde uno de sus campos es le id de usuario
      //   y usuario al crearse arriba en el new user ya tiene un id para relacionarlo
      token.user = user.id;

      // enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        token: token.token,
        name: user.name,
      });

      // ejecutamos las dos promesas al mismo tiempo
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      // obtenemos el token
      const { token } = req.body;
      console.log(token);

      // buscamos el token en la base de datos
      const tokenExist = await Token.findOne({ token });
      console.log(tokenExist);

      // si token no existe enviamos un error
      if (tokenExist == null) {
        console.log("Token no existe");

        const error = new Error("Token no válido");
        return res.status(400).json({ error: error.message });
      }

      // si el token existe buscamos el usuario y lo actualizamos
      const user = await User.findById(tokenExist.user);

      // console.log(user);
      // actualizamos el campo confirmed
      user.confirmed = true;

      // ejecutamos las dos promesas al mismo tiempo de guardar al usuario con el campo confirmado y el borrado del token
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      // enviamos la respueta alm cliente
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      // TODO: LOGIN DE USUARIO

      // TOMAMOS EMAIL Y PASSWORD DEL BODY
      const { email, password } = req.body;

      // BUSCAMOS EL USUARIO POR EMAIL
      const user = await User.findOne({ email });

      // SI NO EXISTE EL USUARIO ENVIAMOS UN ERROR
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }

      //  SI EXISTE EL USUARIO PREGUNTAMOS SI ESTA CONFIMRADA LA CUENTA
      if (!user.confirmed) {
        //TODO: USUARIO NO CONFIRMADO

        // si no esta confifmardo enviarmeos un nuevo correo con un nuevo token

        // CREAMOS UN NUEVO TOKEN
        const token = new Token();

        // DECIEMOS QUE EL USER DE ESTE TOKEN ES IGUAL AL ID DEL USER ENCONTRADO ARRIBA
        token.user = user.id;

        // GENERAMOS UN NUEVO TOKEN
        token.token = generateToken();

        // GUARDAMOS EL TOKEN
        await token.save();

        // enviar email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          token: token.token,
          name: user.name,
        });

        // ENVIAMOS EL AVISO DE ERROR Y EL CORREO PARA QUE CONFIRME CUENTA
        const error = new Error(
          "Cuenta no confirmada, hemos enviado un email de confirmación"
        );
        return res.status(401).json({ error: error.message });
      }

      // REVISAR PASSWORD SI PASO LAS VALDIACIONES
      // tomamos el password de base de datos que es user.password y el password que viene del body
      const isPasswordCorrect = await checkPassword(password, user.password);

      console.log(isPasswordCorrect);

      if (!isPasswordCorrect) {
        const error = new Error("Contraseña incorrecta");
        return res.status(401).json({ error: error.message });
      }

      // generar JWT

      const token = generateJWT({id: user.id});

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // prevenir duplicados
      const user = await User.findOne({ email });

      // si no existe el usuario
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      // confirmar si esta condfirmado
      if (user.confirmed) {
        const error = new Error("El usuario ya esta confirmado");
        return res.status(403).json({ error: error.message });
      }

      // genear token

      const token = new Token();
      //   generatoken n o es una funcionasyncrona
      token.token = generateToken();

      // aqui guardamos la referencia del usuario en el token
      //   ya que token es una instancia nueva donde uno de sus campos es le id de usuario
      //   y usuario al crearse arriba en el new user ya tiene un id para relacionarlo
      token.user = user.id;

      // enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        token: token.token,
        name: user.name,
      });

      // ejecutamos las dos promesas al mismo tiempo
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Se envió un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      //tomamos el email
      const { email } = req.body;

      // prevenir duplicados
      const user = await User.findOne({ email });

      // si no existe el usuario
      if (!user) {
        const error = new Error("El correo no está registrado");
        return res.status(404).json({ error: error.message });
      }

      // genear token

      const token = new Token();
      //   generatoken n o es una funcionasyncrona
      token.token = generateToken();

      // aqui guardamos la referencia del usuario en el token
      //   ya que token es una instancia nueva donde uno de sus campos es le id de usuario
      //   y usuario al crearse arriba en el new user ya tiene un id para relacionarlo
      token.user = user.id;

      await token.save();

      // enviar email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        token: token.token,
        name: user.name,
      });

      // ejecutamos las dos promesas al mismo tiempo

      res.send("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      // obtenemos el token
      const { token } = req.body;
      console.log(token);

      // buscamos el token en la base de datos
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(400).json({ error: error.message });
      }

      res.send("Token válido, define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      // obtenemos el token

      const { token } = req.params;

      // buscamos el token en la base de datos
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(400).json({ error: error.message });
      }

      // el token tiene el id del usuario
      // por lo que buscara si existe
      // todo esto por que neceistamos guardar la nuea contraseña
      // hasheada del usuario en el user
      const user = await User.findById(tokenExist.user);

      // si existe vamos a hashear un poner el nuevo password
      user.password = await hashPassword(req.body.password);

      // guardamos el usuario
      // y borramos el token que usamnos para toda esta operacion
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Password modificado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };


  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };
}
