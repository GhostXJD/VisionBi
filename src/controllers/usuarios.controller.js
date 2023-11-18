import usuario from "../models/usuario.model.js";
import bcrypt from 'bcryptjs'

//Crear Usuario
export const createUsuario = async (req, res) => {
    const { rut, nombre, apellido, correo, password, active, tipoUsuario, company } = req.body;
    try {
        const usuarioFound = await usuario.findOne({ rut });
        if (usuarioFound)
            return res.status(404).json(['El rut ya existe']);

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
    return await usuario.findOne({ correo });
};

export const updatePass = async (req, res) => {
    try {
        const { correo } = req.params
        const usuarioEncontrado = await getUsuarioByCorreo( correo )

        const rut = usuarioEncontrado.rut
        const passwordSinEncriptar = generatePassword(rut)
        const password = bcrypt.hashSync(passwordSinEncriptar, 10)

        await usuario.findOneAndUpdate({correo: correo}, {
            password
        })
        
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ message: "El correo ingresado no existe" });
    }
};