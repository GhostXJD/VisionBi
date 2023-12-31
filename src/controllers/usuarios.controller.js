import usuario from "../models/usuario.model.js";
import bcrypt from 'bcryptjs'

//Crear Usuario
export const createUsuario = async (req, res) => {
    const { rut, nombre, apellido, correo, password, active, tipoUsuario, company } = req.body;
    try {
        const usuarioRut = await usuario.findOne({ rut });
        if (usuarioRut) return res.status(404).json(['Este rut ya existe']);

        const usuarioCorreo = await usuario.findOne({ correo });
        if (usuarioCorreo) return res.status(404).json(['El correo ya existe']);

        const passwordHashs = await bcrypt.hash(password, 10)

        const newUsuario = new usuario({
            rut,
            nombre,
            apellido,
            correo,
            password: passwordHashs,
            active,
            tipoUsuario,
            company
        });

        const userSaved = await newUsuario.save();
        res.json({
            id: userSaved._id,
            rut: userSaved.rut,
            nombre: userSaved.nombre,
            apellido: userSaved.apellido,
            correo: userSaved.correo,
            active: userSaved.active,
            tipoUsuario: userSaved.tipoUsuario,
            company: userSaved.company
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuario.find().select('rut nombre apellido correo active tipoUsuario company');
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const usuarioEncontrado = await usuario.findById(req.params.id);
        if (!usuarioEncontrado) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuarioEncontrado)
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

export const updateUsuario = async (req, res) => {
    try {
        let { rut, nombre, apellido, correo, password, active, tipoUsuario, company } = req.body
        password = bcrypt.hashSync(password, 10)

        await usuario.findByIdAndUpdate({ _id: req.params.id }, {
            rut,
            nombre,
            apellido,
            correo,
            password,
            active,
            tipoUsuario,
            company
        })

        if (!usuario) return res.status(404).json({ message: "Usuario not found" });

        res.json(usuario);
    } catch (error) {
        res.status(404).json({ message: "Usuario not found" });
    }
};

function generatePassword(rut) {
    const rutSinFormato = rut.replace(/\./g, "").replace("-", "").trim();
    const funPass = rutSinFormato.substring(0, 5);
    return funPass
}

const getUsuarioByCorreo = async (correo) => {
    try {
        const usuario = await usuario.findOne({ correo });
        if (!usuario) res.status(404).json(['Este correo no existe']);
        res.json(usuario)
    } catch (error) {
        res.status(404).json(["El correo ingresado no existe"]);
    }
};

export const updatePass = async (req, res) => {
    try {
        const { correo } = req.params
        const usuarioEncontrado = await getUsuarioByCorreo(correo)
        if (!usuarioEncontrado) res.status(404).json(['Este correo no existe']);

        const rut = usuarioEncontrado.rut
        const passwordSinEncriptar = generatePassword(rut)
        const password = bcrypt.hashSync(passwordSinEncriptar, 10)

        await usuario.findOneAndUpdate({ correo: correo }, {
            password
        })

        res.json(usuario);
    } catch (error) {
        res.status(404).json(["El correo ingresado no existe"] );
    }
};

export const updateActive = async (req, res) => {
    try {
        const updatedActive = await usuario.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        )
        if (!updatedActive) return res.status(404).json({ message: "Usuario no encontrado" })
        res.json(updatedActive)
    } catch (error) {
        res.status(404).json({ message: "Usuario no encontrado" });
    }
};

export const updateTypeUser = async (req, res) => {
    try {
        const updatedAType = await usuario.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        )
        if (!updatedAType) return res.status(404).json({ message: "Usuario no encontrado" })
        res.json(updatedAType)
    } catch (error) {
        res.status(404).json({ message: "Usuario no encontrado" });
    }
};