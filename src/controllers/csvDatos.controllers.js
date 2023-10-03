import fs from 'fs';
import csvDato from '../models/csvDato.model.js';

export const getCsvDatos = async (req, res) => {
    try {
        const csvDatos = await csvDato.find(req.params.id);
        res.json(csvDatos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCsvDato = async (req, res) => {
    const { archivoCSV, userUploader, company, date } = req.body;

    try {
        console.log("archivoCSV", archivoCSV?.filename)
        if (!archivoCSV) {
            return res.status(400).json({ message: 'Archivo CSV requerido' });
        }
        
        const archivoCSVBuffer = fs.readFileSync(archivoCSV.path);

        const newCsvDato = new csvDato({
            archivoCSV: archivoCSVBuffer,
            userUploader: userUploader,
            company: company,
            date: new Date(),
        });

        fs.unlinkSync(archivoCSV.path);

        const savedCsvDato = await newCsvDato.save();
        res.json(savedCsvDato);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error", error)
    }
};

export const getCsvDato = async (req, res) => {
    try {
        const csv = await csvDato.findById(req.params.id);
        if (!csv) return res.status(404).json({ message: 'Csv not found' });
        res.json(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCsvDato = async (req, res) => {
    try {
        const updatedCsv = await csvDato.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!updatedCsv) return res.status(404).json({ message: 'Csv not found' });

        res.json(updatedCsv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCsvDato = async (req, res) => {
    try {
        const deletedCsv = await csvDato.findByIdAndDelete(req.params.id);
        if (!deletedCsv) return res.status(404).json({ message: 'Csv not found' });
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

