import csvDato from '../models/csvDato.model.js';
import * as tf from '@tensorflow/tfjs-node' // Usa '@tensorflow/tfjs-node' para Node.js
import Papa from 'papaparse';

export const getPredict = async (req, res) => {
    try {

        const modelPath = 'file://src/python/model.json';

        const model = await tf.loadLayersModel(modelPath).catch((error) => {
            console.error('Error al cargar el modelo:', error);
            return;
        });
        if (!model) {
            return res.status(500).json({ message: 'No existe modelo' });
        }
        const { company } = req.params;
        const csvDatoRecord = await getCsvDatoByCompany(company);

        if (!csvDatoRecord) {
            return res.status(404).json({ message: 'Registro de CSV no encontrado' });
        }

        const csvDataText = csvDatoRecord.archivoCSV.toString('utf-8');

        // Analizar los datos CSV con papaparse y convertirlos en un formato adecuado
        const parsedData = Papa.parse(csvDataText, { header: true, dynamicTyping: true });

        // Reorganiza los datos para que coincidan con [batch_size, sequence_length, feature_dim]
        const featureColumns = ['order', 'state', 'neighborhood', 'value', 'quantity', 'category', 'gender', 'skuValue', 'price', 'totalValue']; // Nombres de las columnas de características

        // Filtra solo las columnas de características necesarias
        const selectedFeatures = parsedData.data.map(row => featureColumns.map(col => row[col]));

        // Normaliza los datos si es necesario
        const minMaxScaler = new MinMaxScaler(); // Suponiendo que estás utilizando un MinMaxScaler
        const normalizedData = minMaxScaler.fitTransform(selectedFeatures);

        // Convierte los datos en un tensor TensorFlow
        const inputData = tf.tensor(normalizedData); // Asegúrate de que tus datos sean un array 2D

        // Añade una dimensión de lote si es necesario
        const batchedInputData = inputData.expandDims(0); // Esto agrega una dimensión de lote de tamaño 1

        // Realiza la predicción con el modelo
        const predictions = model.predict(batchedInputData);

        // Convierte las predicciones a un formato que puedas enviar al cliente
        const result = predictions.arraySync();
        // Envía las predicciones al cliente
        res.json({ predictions: result });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error en la predicción' });
    }
};

// Función para obtener el archivo CSV por el nombre de la compañía SOLO PARA OCUPAR LA FUNCION DE PREDECIR
const getCsvDatoByCompany = async (company) => {
    return await csvDato.findOne({ company });
};

export const getCsvDatos = async (req, res) => {
    try {
        const csvDatos = await csvDato.find(req.params.id);
        res.json(csvDatos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCsvDato = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Archivo CSV requerido' });
        }

        const { userUploader, company } = req.body;

        // Verificar si ya existe un registro con el mismo userUploader y company
        const existingCsvDato = await csvDato.findOne({ userUploader, company });

        if (existingCsvDato) {
            // Si existe, actualiza el registro existente con el nuevo archivo
            existingCsvDato.archivoCSV = req.file.buffer;
            existingCsvDato.date = new Date();
            const updatedCsvDato = await existingCsvDato.save();
            res.json(updatedCsvDato);
        } else {
            // Si no existe, crea un nuevo registro
            const newCsvDato = new csvDato({
                archivoCSV: req.file.buffer,
                userUploader: userUploader,
                company: company,
                date: new Date(),
            });

            const savedCsvDato = await newCsvDato.save();
            res.json(savedCsvDato);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error", error);
    }
};


export const getCsvDato = async (req, res) => {
    try {
        const { company } = req.params;

        const csvDatoRecord = await csvDato.findOne({ company });

        if (!csvDatoRecord) {
            return res.status(404).json({ message: 'Registro de CSV no encontrado' });
        }

        const csvDataBinary = Buffer.from(csvDatoRecord.archivoCSV, 'base64');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=archivo.csv');
        res.send(csvDataBinary);
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