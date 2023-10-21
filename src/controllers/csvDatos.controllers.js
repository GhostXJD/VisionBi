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
        const featureColumns = ['order', 'state', 'neighborhood', 'value', 'quantity', 'category', 'gender', 'skuValue', 'price', 'totalValue'];

        const sequenceLength = 180; // Establece la longitud de la secuencia a 180 para que coincida con lo que espera el modelo

        // Crear secuencias de datos
        const dataSequences = [];
        for (let i = 0; i < parsedData.data.length - sequenceLength; i++) {
            const sequence = parsedData.data.slice(i, i + sequenceLength).map(row => featureColumns.map(col => parseFloat(row[col], 10)));
            dataSequences.push(sequence);
        }

        // Inicializa variables para almacenar el valor mínimo y máximo.
        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;

        // Itera a través de los datos para encontrar el valor mínimo y máximo en la columna 'skuValue'.
        parsedData.data.forEach((row) => {
            const skuValue = row['skuValue'];
            if (typeof skuValue === 'number') {
                minValue = Math.min(minValue, skuValue);
                maxValue = Math.max(maxValue, skuValue);
            }
        });

        console.log('Valor mínimo de skuValue:', minValue);
        console.log('Valor máximo de skuValue:', maxValue);

        // Convierte las secuencias de datos en tensores
        const inputData = tf.tensor(dataSequences);

        // Realiza la predicción con el modelo
        const predictions = model.predict(inputData);

        // Convierte las predicciones a un formato que puedas enviar al cliente
        const scaledPredictions = predictions.arraySync();

        // Realiza el escalado inverso en cada valor de predicción
        const originalPredictions = scaledPredictions.map((scaledValue) => {
            return scaledValue.map((value) => {
                const originalValue = (value - (-1)) / (1 - (-1)) * (maxValue - minValue) + minValue;
                return originalValue;
            });
        });

        // Envía las predicciones al cliente
        res.json({ predictions: originalPredictions });
    } catch (error) {
        console.log(error);
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