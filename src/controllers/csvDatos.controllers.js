import csvDato from '../models/csvDato.model.js'

export const getCsvDatos = async (req, res) => {
    const csv = await csvDato.find({
        usuario: req.usuario.id
    }).populate('usuario')
    res.json(csv);
};

export const createCsvDato = async (req, res) => {
    const { codProducto, cantidadProducto, precioUnitario, descuento, total, fechaVenta } = req.body

    const newCsv = new csvDato({
        codProducto,
        cantidadProducto,
        precioUnitario,
        descuento,
        total,
        fechaVenta,
        usuario: req.usuario.id
    })
    const savedCsv = await newCsv.save();
    res.json(savedCsv)
};

export const getCsvDato = async (req, res) => {
    const csv = await csvDato.findById(req.params.id).populate('usuario')
    if (!csv) return res.status(404).json({ message: 'Csv not found' })
    res.json(csv)
};

export const deleteCsvDatos = async (req, res) => {
    const csv = await csvDato.findByIdAndDelete(req.params.id)
    if (!csv) return res.status(404).json({ message: 'Csv not found' })
    return res.sendStatus(204)
};
export const updateCsvDatos = async (req, res) => {
    const csv = await csvDato.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if (!csv) return res.status(404).json({ message: 'Csv not found' })
    res.json(csv)
};
