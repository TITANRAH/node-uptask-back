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

      const token = generateJWT({ id: user.id });

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

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const userExist = await User.findOne({ email });

    // TODO: VALIDACION DE EMAIL DUPLICADO POR QUE SI NO TE PUEES PONER EL EMAIL DE OTRO SER
    // COMO BUSCO AL USUARIO SI EXISTE PARA PODER DECIR QUE EL CORREO QUE QUIERE CAMBIAR ESTA EN USO
    // ME TRAE UN ID DE USUARIO
    // POR LO QUE PUEDO COMPRAR LOS IDS ,DEL USUARUO AUTENTICADO Y EL USUARIO ENCONTRADO EN LA BD
    // ESTO ME PERMITIRA CAMBIAR MI NOMBRE SOLAMEBTE Y ME DEJARA
    // YA QUE SI NO SOY YO EL QUE ESTA AUTENTICADO Y QUIERO CAMBIAR EL EMAIL
    // NO DEBERIA DEJARME
    // EN CAMBIO SI ESTOY AUTENTICADO Y AL BUSCAR EL CORREO TOMANDO EL CORREO QUE INGRESE PARA LA ACTUALIZACION
    // AHI DEBERUIA DEJARME CAMBIAR SOLO EL NOMBRE
    // DE LO CONTRARIO LANZARA ERROR
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error("Ese email ya está en uso");
      return res.status(409).json({ error: error.message });
    }

    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    console.log("updateCurrentUserPassword");

    // TODO: ACTUALIZAR CONTRASEÑA DE USUARIO
    const { current_password, password } = req.body;

    // tomamos al usuario que viene en el middleware
    const user = await User.findById(req.user.id);

    // isPasswordCorrect es una promesa
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );

    // si la contraseña no es correcta
    if (!isPasswordCorrect) {
      const error = new Error("Contraseña actual incorrecta");
      return res.status(401).json({ error: error.message });
    }

    try {
      // si la contraseña es correcta
      // el user del middlware osea el que esta haciendo la peticion
      // tendra una nueva contraseña hasheada
      user.password = await hashPassword(password);

      //guardamos el usuario
      await user.save();

      res.send("El password se modificó correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static checkPassword = async (req: Request, res: Response) => {

    const { password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(password, user.password);

    if(!isPasswordCorrect){
      const error = new Error("Contraseña incorrecta");
      return res.status(401).json({ error: error.message });
    }

    res.send('Password correcto')
  }

}
