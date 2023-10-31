import csvDato from '../models/csvDato.model.js';
import * as tf from '@tensorflow/tfjs-node' // Usa '@tensorflow/tfjs-node' para Node.js
import Papa from 'papaparse';

export const getPredict = async (req, res) => {
    try {
        const modelPath = 'file://src/python/model1.json';

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
        const cleanedCsvData = csvDataText.slice(0, -1);
        const parsedData = Papa.parse(cleanedCsvData, {
            header: true,
            dynamicTyping: true,
            newline: '\r\n'  // Configura el carácter de nueva línea
        });

        const data = parsedData.data;

        if (data.length < 181) {
            return res.status(400).json({ message: 'No hay suficientes filas para predecir' });
        }

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
            return featureColumns.map((col) => {
                if (col == 'state') {
                    row[col] = stateMapping[row[col]]
                }
                if (col == 'neighborhood') {
                    row[col] = neighborhoodMapping[row[col]]
                }
                if (col == 'category') {
                    row[col] = categoryMapping[row[col]]
                }
                if (col == 'gender') {
                    row[col] = genderMapping[row[col]]
                }
                return row[col]
            });
        });

        //Se establece una longitud de secuencia deseada en la variable sequenceLength
        const sequenceLength = 180;

        // Se crean secuencias de datos deslizantes con una longitud de sequenceLength. Estas secuencias se utilizan para alimentar el modelo de aprendizaje automático.
        const dataSequences = [];
        for (let i = 0; i < filteredData.length - sequenceLength; i++) {
            const sequence = filteredData.slice(i, i + sequenceLength).map((row) =>
                row.map((value) => parseFloat(value, 10))
            );
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
                return parseInt(originalValue);
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