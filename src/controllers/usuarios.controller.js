import usuario from "../models/usuario.model.js";
import bcrypt from 'bcryptjs'

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuario.find().select('nombre rut correo tipoUsuario active');
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const usuarioEncontrado = await usuario.findById(req.params.id);
        if (!usuarioEncontrado) return res.status(404).json({ message: 'Usuario no encontrados' });
        res.json(usuarioEncontrado)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUsuario = async (req, res) => {
    const { nombre, rut, correo, password, active, tipoUsuario } = req.body;
    try {
        const usuarioFound = await usuario.findOne({ rut });
        if (usuarioFound)
            return res.status(404).json(['El rut ya existe']);

        const passwordHashs = await bcrypt.hash(password, 10)

        const newUsuario = new usuario({
            nombre,
            rut,
            correo,
            password: passwordHashs,
            active,
            tipoUsuario
        });

        const userSaved = await newUsuario.save();
        res.json({
            id: userSaved._id,
            nombre: userSaved.nombre,
            rut: userSaved.rut,
            correo: userSaved.correo,
            active: userSaved.active,
            tipoUsuario: userSaved.tipoUsuario
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const deleteUsuario = async (req, res) => {
    try {
        const usuarioEncontrado = await usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEncontrado) return res.status(404).json({ message: "Usuario not found" });
        return res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ message: "Usuario not found" });
    }
};

/* TODO: Puede que cambie el update, cambiarlo una vez probado en el front*/
export const updateUsuario = async (req, res) => {
    try {
        const usuario = await usuario.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!usuario) return res.status(404).json({ message: "Usuario not found" });
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ message: "Usuario not found" });
    }
};