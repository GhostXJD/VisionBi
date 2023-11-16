import mensaje from "../models/message.model.js";


//Crear Usuario
export const createMessage = async (req, res) => {
    const { nombre, correo, message, status } = req.body;
    try {
        const newMessage = new mensaje({
            nombre,
            correo,
            message,
            status
        });

        const messageSaved = await newMessage.save();
        res.json({
            id: messageSaved._id,
            nombre: messageSaved.nombre,
            correo: messageSaved.correo,
            message: messageSaved.message,
            status: messageSaved.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const getMessages = async (req, res) => {
    try {
        const messages = await mensaje.find().select('nombre correo message status');
        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessage = async (req, res) => {
    try {
        const messageEncontrado = await mensaje.findById(req.params.id);
        if (!messageEncontrado) return res.status(404).json({ message: 'Message not found' });
        res.json(messageEncontrado)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const messageEncontrado = await mensaje.findByIdAndDelete(req.params.id);
        if (!messageEncontrado) return res.status(404).json({ message: "Message not found" });
        return res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ message: "Message not found" });
    }
};
