import * as tf from '@tensorflow/tfjs-node';
import Papa from 'papaparse';
import path from 'path';

export const predictFromCSV = async (modelPath, csvDataText) => {
    try {
        // Analizar los datos CSV con papaparse y convertirlos en un formato adecuado
        const parsedData = Papa.parse(csvDataText, { header: true, dynamicTyping: true });

        // Construye la ruta al modelo utilizando path
        const model = await tf.loadLayersModel(`file://${path.resolve(modelPath)}`).catch((error) => {
            console.error('Error al cargar el modelo:', error);
            return;
        });

        if (!model) {
            return { error: 'No model exists' };
        }

        // Realizar predicciones con el modelo LSTM
        const predictions = model.predict(parsedData.data);

        return { predictions };
    } catch (error) {
        console.log(error);
        return { error: 'Error en la predicción' };
    }
};