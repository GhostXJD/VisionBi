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

        const cleanedCsvData = csvDataText.slice(0, -1);
        const parsedData = Papa.parse(cleanedCsvData, {
            header: true,
            dynamicTyping: true,
            newline: '\r\n'
        });

        let data = parsedData.data;

        data = data.map((row) => ({
            ...row,
            date: new Date(row.date)
        }));

        data.sort((a, b) => a.date - b.date);

        if (data.length < 181) {
            return res.status(400).json({ message: 'No hay suficientes filas para predecir' });
        }
<<<<<<< HEAD

        const featureColumns = ['date', 'skuValue'];
        const filteredData = data.map((row) => {
=======

        // Ordena los datos por la columna 'order' en orden ascendente
        data.sort((a, b) => a.order - b.order);

        const dataForPrediction = data.slice(-181).filter(item => item.order !== null);


        // Se define un conjunto de nombres de columnas de características que se utilizarán en el análisis posterior.
        const featureColumns = ['order', 'state', 'neighborhood', 'value', 'quantity', 'category', 'gender', 'skuValue', 'price', 'totalValue'];

        // Se crea una serie de mapeos y conjuntos únicos para diferentes columnas de los datos. Estos mapeos se utilizarán para transformar valores categóricos en valores numéricos.
        const uniqueStates = [...new Set(parsedData.data.map(row => row['state']))];
        const uniqueNeighborhoods = [...new Set(parsedData.data.map(row => row['neighborhood']))];
        const uniqueCategories = [...new Set(parsedData.data.map(row => row['category']))];
        const uniqueGender = [...new Set(parsedData.data.map(row => row['gender']))];

        const stateMapping = {};
        const neighborhoodMapping = {};
        const categoryMapping = {};
        const genderMapping = {};

        uniqueStates.forEach((state, index) => stateMapping[state] = index);
        uniqueNeighborhoods.forEach((neighborhood, index) => neighborhoodMapping[neighborhood] = index);
        uniqueCategories.forEach((category, index) => categoryMapping[category] = index);
        uniqueGender.forEach((quantity, index) => genderMapping[quantity] = index);

        // Filtra solo las columnas necesarias
        const filteredData = dataForPrediction.map((row) => {
>>>>>>> main
            return featureColumns.map((col) => {
                return row[col];
            });
        });
        
        const sumByDate = {};
        
        filteredData.forEach((row) => {
            const date = row[0]; 
            const skuValue = row[1]; 
        
            const dateKey = date.toISOString().split('T')[0];
        
            if (sumByDate[dateKey]) {
                sumByDate[dateKey] += skuValue;
            } else {
                sumByDate[dateKey] = skuValue;
            }
        });
        
        const aggregatedData = Object.entries(sumByDate).map(([date, sum]) => ({
            date,
            skuValue: sum,
        }));

        const dataForPrediction = aggregatedData.slice(-181).filter(item => item.order !== null);

        const predictColumns = ['skuValue'];
        const predictedData = dataForPrediction.map((row) => {
            return predictColumns.map((col) => {
                return row[col];
            });
        });

        const sequenceLength = 180;

        const dataSequences = [];
        for (let i = 0; i < predictedData.length - sequenceLength; i++) {
            const sequence = predictedData.slice(i, i + sequenceLength).map((row) =>
                row.map((value) => parseFloat(value, 10))
            );
            dataSequences.push(sequence);
        }

        let min = Infinity;
        let max = -Infinity;

        for (const sequence of dataSequences) {
            for (const row of sequence) {
                for (const value of row) {
                    if (value < min) {
                        min = value;
                    }
                    if (value > max) {
                        max = value;
                    }
                }
            }
        }

        const scaledDataSequences = dataSequences.map((sequence) =>
            sequence.map((row) =>
                row.map((value) => (value - min) / (max - min))
            )
        );

        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;

        dataForPrediction.forEach((row) => {
            const skuValue = row['skuValue'];
            if (typeof skuValue === 'number') {
                minValue = Math.min(minValue, skuValue);
                maxValue = Math.max(maxValue, skuValue);
            }
        });

        const inputData = tf.tensor(scaledDataSequences);

        const predictions = model.predict(inputData);

        const scaledPredictions = predictions.arraySync();

        const originalPredictions = scaledPredictions.map((scaledValue) => {
            return scaledValue.map((value) => {
                const originalValue = (value - (0)) / (1 - (0)) * (maxValue - minValue) + minValue;
                return parseInt(originalValue);
            });
        });

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
            // Si existe, elimina el archivo CSV existente
            // y luego crea uno nuevo
            const deletedCsvDato = await csvDato.findOneAndDelete({ userUploader, company });

            if (deletedCsvDato) {
                const newCsvDato = new csvDato({
                    archivoCSV: req.file.buffer,
                    userUploader: userUploader,
                    company: company,
                    date: new Date(),
                });

                const savedCsvDato = await newCsvDato.save();
                return res.json(savedCsvDato);
            }
        } else {
            // Si no existe, crea un nuevo registro
            const newCsvDato = new csvDato({
                archivoCSV: req.file.buffer,
                userUploader: userUploader,
                company: company,
                date: new Date(),
            });

            const savedCsvDato = await newCsvDato.save();
            return res.json(savedCsvDato);
        }

        return res.status(500).json({ message: 'No se pudo actualizar ni crear el registro' });
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