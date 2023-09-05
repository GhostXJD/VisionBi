import usuario from "../models/usuario.model.js";
import bcrypt from 'bcryptjs'
import { createAccessToken } from "../libs/jwt.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";

export const registro = async (req, res) => {
    const { nombre, correo, password, active, tipoUsuario } = req.body;
    try {
        const usuarioFound = await usuario.findOne({ correo });
        if (usuarioFound)
            return res.status(404).json(['El correo ya existe']);

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

};

export const login = async (req, res) => {
    const { correo, password } = req.body;
    try {

        const usuarioFound = await usuario.findOne({ correo })

        if (!usuarioFound) return res.status(400).json({ message: "user not found" });

        const isMatch = await bcrypt.compare(password, usuarioFound.password);

        if (!isMatch) return res.status(400).json(["Contraseña incorrecta"]);

        const token = await createAccessToken({ id: usuarioFound._id })
        res.cookie('token', token);
        res.json({
            id: usuarioFound._id,
            nombre: usuarioFound.nombre,
            correo: usuarioFound.correo,
            active: usuarioFound.active,
            tipoUsuario: usuarioFound.tipoUsuario
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const logout = async (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    const usuarioFound = await usuario.findById(req.usuario.id)

    if (!usuarioFound) return res.status(400).json({ message: "user not found" });

    return res.json({
        id: usuarioFound._id,
        nombre: usuarioFound.nombre,
        correo: usuarioFound.correo,
        active: usuarioFound.active,
        tipoUsuario: usuarioFound.tipoUsuario
    })
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "unauthorized" });

    jwt.verify(token, TOKEN_SECRET, async (err, usuario) => {
        if (err) return res.status(401).json({ message: "unauthorized" });

        const usuarioFound = await usuario.findById(usuario.id);
        if (!usuarioFound) return res.status(401).json({ message: "unauthorized" });

        return res.json({
            id: usuarioFound._id,
            nombre: usuarioFound.nombre,
            correo: usuarioFound.correo,

        });
    })
};