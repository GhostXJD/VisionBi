import React from 'react'
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { getCsvDatoRequest, getPredictByCategoryRequest } from "../api/csvDatos";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

function DashboardByCategoryPage() {

    const { usuario } = useAuth();
    const [csvData, setCsvData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dataAvailable, setDataAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [predictCategoryData, setPredictCategoryData] = useState([]);
    const [salesByDay, setSalesByDay] = useState([]);

    useEffect(() => {
        getCsv();
    }, []);

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#8F3C8A"),
        backgroundColor: "#8F3C8A",
        '&:hover': {
            backgroundColor: "#ba68c8",
        },
        fontFamily: 'Poppins',
    }));

    const getCsv = async () => {
        try {
            const response = await getCsvDatoRequest(usuario.company);
            //console.log("Respuesta de la API:", response);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: moment(row.date).format('YYYY-MM-DD'),
                    }));
                    setCsvData(data);
                    setDataAvailable(true);
                },
                header: true,
                skipEmptyLines: true,
            });
            setLoading(true);
        } catch (error) {
            console.log("Error al obtener los datos:", error);
            setDataAvailable(false);
        } finally {
            setLoading(false)
        }
    };

    const getPredictByCategory = async () => {
        try {
            if (!selectedCategory) {
                console.log("Por favor selecciona categoria");
                return;
            }
            const res = await getPredictByCategoryRequest(usuario.company, { category: selectedCategory });
            console.log('Predict by category: ', res.data)
            setPredictCategoryData(res.data);
            setLoading(true)
        } catch (error) {
            console.log("Error al predecir", error);
        } finally {
            setLoading(false)
        }
    };

    const Prediction = () => {
        const sortedChartData = [["Date", "Total", "Predicted"]];

        if (csvData.length === 0) {
            return <div>No hay datos disponibles para graficar.</div>;
        }

        // Encuentra la última fecha en el archivo CSV
        const lastDate = new Date(csvData[csvData.length - 1].date);

        // Calcula la fecha de inicio para los últimos 30 días
        const thirtyDaysAgo = new Date(lastDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Filtra los datos para incluir solo los últimos 30 días
        const last30DaysData = csvData.filter((rowData) => {
            const fecha = new Date(rowData.date);
            return fecha >= thirtyDaysAgo;
        });

        // Crea un objeto para mantener un seguimiento de los valores acumulados por día
        const dailyTotal = {};
        const dailyPredicted = {}; // Para almacenar las predicciones diarias

        // Recorre los datos de los últimos 30 días
        for (let i = 0; i < last30DaysData.length; i++) {
            const rowData = last30DaysData[i];
            const fecha = new Date(rowData.date);
            const valorTotal = rowData.quantity * rowData.price;

            // Encuentra la predicción correspondiente para esta fecha
            const predictedValues = predictData.predictions[0]; // asumiendo que solo hay una predicción
            const predictedValue = predictedValues[i]; // predicción para el mismo período de tiempo que los datos originales

            // Obtiene la fecha en formato YYYY-MM-DD
            const dateKey = fecha.toISOString().split('T')[0];

            // Agrega el valor actual al valor acumulado para este día
            if (dailyTotal[dateKey]) {
                dailyTotal[dateKey].total += valorTotal;
                dailyTotal[dateKey].predicted += predictedValue;
            } else {
                dailyTotal[dateKey] = {
                    total: valorTotal,
                    predicted: predictedValue,
                };
            }

            // También almacena la predicción diaria
            dailyPredicted[dateKey] = predictedValue;
        }

        // Convierte los datos diarios en un arreglo para el gráfico
        const sortedDates = Object.keys(dailyTotal).sort();

        for (const dateKey of sortedDates) {
            sortedChartData.push([dateKey, dailyTotal[dateKey].total, dailyTotal[dateKey].predicted]);
        }

        if (predictData.predictions && predictData.predictions.length > 0) {
            predictData.predictions.forEach((prediction) => {
                sortedChartData.push([prediction.date, null, prediction.skuValue]);
            });
        }

        return (
            <div>
                <Chart
                    chartType="LineChart"
                    width="100%"
                    height="400px"
                    data={sortedChartData}
                    options={{
                        hAxis: {
                            title: "Date",
                        },
                        vAxis: {
                            title: "Value",
                        },
                        series: {
                            0: { curveType: "function" },
                            1: { curveType: "function" },
                        },
                        pointSize: 6, // Ajusta el tamaño de los puntos en la línea
                        legend: {
                            position: "bottom",
                        },
                    }}
                />
            </div>
        );
    };


    return (
        <div className='mt-14'>
            {loading ? (
                <div className="text-center"> Loading ... </div>
            ) : (
                <>
                    {dataAvailable ? (
                        <div className="">
                            <label htmlFor="categorySelect">Select Category:</label>
                            <select
                                id="categorySelect"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {Array.from(new Set(csvData.map((row) => row.category))).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <button onClick={getPredictByCategory}>Get Predictions</button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-center">No data uploaded, you must upload a CSV</h1>
                            <div className="font-sans text-center">
                                <Link to="/uploadfile" ><ColorButton >Click here, For upload CSV</ColorButton></Link>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default DashboardByCategoryPage
