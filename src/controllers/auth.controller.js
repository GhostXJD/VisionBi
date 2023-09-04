import usuario from "../models/usuario.model.js";
import bcrypt from 'bcryptjs'
import { createAccessToken } from "../libs/jwt.js";

export const registro = async (req, res) => {
    const { nombre, correo, password, active, tipoUsuario } = req.body;
    try {
        const passwordHashs = await bcrypt.hash(password, 10)

        const newUsuario = new usuario({
            nombre,
            correo,
            password: passwordHashs,
            active,
            tipoUsuario
        });

        const userSaved = await newUsuario.save();
        const token = await createAccessToken({ id: userSaved._id })
        res.cookie('token', token);
        res.json({
            id: userSaved._id,
            nombre: userSaved.nombre,
            correo: userSaved.correo,
            active: userSaved.active,
            tipoUsuario: userSaved.tipoUsuario
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const login = (req, res) => res.send("login")