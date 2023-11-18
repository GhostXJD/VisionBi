import csvDato from '../models/csvDato.model.js';
import * as tf from '@tensorflow/tfjs-node' // Usa '@tensorflow/tfjs-node' para Node.js
import Papa from 'papaparse';

export const getPredict = async (req, res) => {
    try {
        const modelPath = 'file://src/python/general/model.json';

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

        const featureColumns = ['date', 'skuValue'];
        const filteredData = data.map((row) => {
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
        let sum = 0;
        let count = 0;

        for (const sequence of dataSequences) {
            for (const row of sequence) {
                for (const value of row) {
                    if (value < min) {
                        min = value;
                    }
                    sum += value;
                    count++;
                }
            }
        }

        const average = sum / count;
        const max = parseInt(average);

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
                const originalValue = (value - (-1)) / (1 - (-1)) * (max - min) + min;
                return parseInt(originalValue);
            });
        });

        const formattedPredictions = originalPredictions.flatMap(prediction => prediction);

        const lastDate = new Date(dataForPrediction[dataForPrediction.length - 1].date);

        // Crea un arreglo de fechas futuras comenzando un día después de la última fecha
        const futureDates = [];
        for (let i = 0; i < 30; i++) {
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + i + 1);
            futureDates.push(nextDate.toISOString().split('T')[0]);
        }

        // Combina las fechas futuras con los valores en formattedPredictions
        const predictionsWithDates = [];
        for (let i = 0; i < futureDates.length; i++) {
            const date = futureDates[i];
            const skuValue = formattedPredictions[i];
            predictionsWithDates.push({ date, skuValue });
        }

        res.json({ predictions: predictionsWithDates });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en la predicción' });
    }
};

export const postPredictCategory = async (req, res) => {
    try {
        const modelPath = 'file://src/python/category/model.json';

        const model = await tf.loadLayersModel(modelPath).catch((error) => {
            console.error('Error al cargar el modelo:', error);
            return;
        });

        if (!model) {
            return res.status(500).json({ message: 'No existe modelo' });
        }

        const { company } = req.params;
        const { category } = req.body;
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

        data = data.filter(row => row.category === category);

        data = data.map((row) => ({
            ...row,
            date: new Date(row.date)
        }));

        data = data.sort((a, b) => a.date - b.date);



        const featureColumns = ['date', 'skuValue'];
        const filteredData = data.map((row) => {
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

        const dataForScaler = aggregatedData.filter(item => item.order !== null);

        const dataForPrediction = aggregatedData.slice(-61).filter(item => item.order !== null);

        const predictColumns = ['skuValue'];
        const predictedData = dataForPrediction.map((row) => {
            return predictColumns.map((col) => {
                return row[col];
            });
        });
        const sequenceLength = 60;

        const dataSequences = [];
        for (let i = 0; i < predictedData.length - sequenceLength; i++) {
            const sequence = predictedData.slice(i, i + sequenceLength).map((row) =>
                row.map((value) => parseFloat(value, 10))
            );
            dataSequences.push(sequence);
        }

        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;
        let min = Infinity;
        let max = -Infinity;
        let sum = 0;
        let count = 0;

        dataForScaler.forEach((row) => {
            const skuValue = row['skuValue'];
            if (typeof skuValue === 'number') {
                minValue = Math.min(minValue, skuValue);
                maxValue = Math.max(maxValue, skuValue);
                sum += skuValue;
                count++;
            }
        });

        const Average = count > 0 ? sum / count : 0;


        for (const sequence of dataSequences) {
            for (const row of sequence) {
                for (const value of row) {
                    if (value < min) {
                        min = value;
                    }
                    if (value > max) {
                        max = value;
                    }
                    sum += value;
                    count++;
                }
            }
        }

        const average = sum / count;

        const scaledDataSequences = dataSequences.map((sequence) =>
            sequence.map((row) =>
                row.map((value) => (value - min) / (average - min))
            )
        );

        const inputData = tf.tensor(scaledDataSequences);

        const predictions = model.predict(inputData);

        const scaledPredictions = predictions.arraySync();

        const originalPredictions = scaledPredictions.map((scaledValue) => {
            return scaledValue.map((value) => {
                const originalValue = (value - (-1)) / (1 - (-1)) * (Average - min) + min;
                return parseInt(originalValue);
            });
        });

        const formattedPredictions = originalPredictions.flatMap(prediction => prediction);

        const lastDate = new Date(dataForPrediction[dataForPrediction.length - 1].date);

        // Crea un arreglo de fechas futuras comenzando un día después de la última fecha
        const futureDates = [];
        for (let i = 0; i < 30; i++) {
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + i + 1);
            futureDates.push(nextDate.toISOString().split('T')[0]);
        }

        // Combina las fechas futuras con los valores en formattedPredictions
        const predictionsWithDates = [];
        for (let i = 0; i < futureDates.length; i++) {
            const date = futureDates[i];
            const skuValue = formattedPredictions[i];
            predictionsWithDates.push({ date, skuValue });
        }

        res.json({ predictionsCategory: predictionsWithDates });
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