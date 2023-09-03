import usuario from "../models/usuario.model.js";

export const registro = async (req, res) => {
    const { nombre, correo, password, active, tipoUsuario } = req.body;
    try {
        const newUsuario = new usuario({
            nombre,
            correo,
            password,
            active,
            tipoUsuario
        });

        await newUsuario.save();
        console.log(newUsuario);
    } catch (error) {
        console.log(error);
    }

}

export const login = (req, res) => res.send("login")