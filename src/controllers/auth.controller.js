import usuario from "../models/usuario.model.js";

export const registro = async (req, res) => {
    const { correo, password ,nombre} = req.body;
    try {
        const newUsuario = new usuario({
            correo,
            password,
            nombre,
        });

        await newUsuario.save();
    }   catch (error) {
        console.log(error);
    }
    console.log(newUsuario);
    res.send("registrando")
}

export const login = (req, res) => res.send("login")