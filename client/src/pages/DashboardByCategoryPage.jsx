import React from 'react'
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { getCsvDatoRequest, getPredictByCategoryRequest } from "../api/csvDatos";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2'

function DashboardByCategoryPage() {

    const { usuario } = useAuth();
    const [csvData, setCsvData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryText, setSelectedCategoryText] = useState("");
    const [dataAvailable, setDataAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [filteredCsvData, setFilteredCsvData] = useState([]);
    const [predictCategoryData, setPredictCategoryData] = useState([]);


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

            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: moment(row.date, 'YYYY-MM-DD'),
                    }));

                    data.sort((a, b) => a.date - b.date);

                    const formattedData = data.map((row) => ({
                        ...row,
                        date: row.date.format('YYYY-MM-DD'),
                    }));

                    setCsvData(formattedData);
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
                console.log('Por favor selecciona categoría');
                return;
            }

            const filteredData = csvData.filter((row) => row.category === selectedCategory);
            setSelectedCategoryText(selectedCategory);

            const dailyTotal = {};

            filteredData.forEach((rowData) => {
                const date = rowData.date;
                const sales = parseFloat(rowData.skuValue);

                if (dailyTotal[date]) {
                    dailyTotal[date] += sales;
                } else {
                    dailyTotal[date] = sales;
                }
            });

            const aggregatedData = Object.entries(dailyTotal).map(([date, sum]) => ({
                date,
                skuValue: sum,
            }));

            if (aggregatedData.length < 60) {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Datos insuficientes!',
                    text: 'Necesitas un mínimo de 60 datos.',
                    confirmButtonColor: '#8F3C8A',
                });
                return; 
            }


            const res = await getPredictByCategoryRequest(usuario.company, { category: selectedCategory });
            setPredictCategoryData(res.data);

            const sortedChartData = Object.entries(dailyTotal)
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([date, total]) => [date, total]);

            const futureDates = res.data.predictionsCategory.map((prediction) => prediction.date);

            const futurePredictions = res.data.predictionsCategory.filter((prediction) =>
                futureDates.includes(prediction.date)
            );

            const futureChartData = futurePredictions.map((prediction) => [
                prediction.date,
                null,
                prediction.skuValue,
            ]);

            const historicalChartData = sortedChartData.map(([date, total]) => [date, total, null]);

            const combinedChartData = [...historicalChartData, ...futureChartData];

            setChartData(combinedChartData);
            setLoading(false);
        } catch (error) {
            console.log('Error al predecir', error);
            setLoading(false);
        }
    };

    const isCategorySelected = selectedCategory !== "";

    useEffect(() => {
        if (selectedCategory !== "") {
            const filteredData = csvData.filter((row) => row.category === selectedCategory);
            setFilteredCsvData(filteredData);
        }
    }, [selectedCategory, csvData]);

    return (
        <div className='mt-14'>
            {loading ? (
                <div className="text-center"> Cargando ... </div>
            ) : (
                <>
                    {dataAvailable ? (
                        <div sx={{ minWidth: 120 }}>
                            <FormControl sx={{ minWidth: 300 }}>
                                <InputLabel id="">Selecciona una categoría:</InputLabel>
                                <Select
                                    id="categorySelect"
                                    label="Selecciona una categoría:"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {Array.from(new Set(csvData.map((row) => row.category)))
                                        .filter((category) => category.trim() !== "") 
                                        .sort()
                                        .map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <Button disabled={!isCategorySelected} onClick={getPredictByCategory} color='secondary' variant="contained">
                                Obtener predicción
                            </Button>
                            {chartData.length > 0 && (
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="LineChart"
                                    loader={<div>Cargado gráfico</div>}
                                    data={[
                                        ['Fecha', 'Ventas reales', 'Ventas Pronosticadas'],
                                        ...chartData
                                    ]}
                                    options={{
                                        title: `Ventas Totales vs Ventas Predichas por Día de ${selectedCategoryText}`,
                                        hAxis: {
                                            title: 'Fecha',
                                        },
                                        vAxis: {
                                            title: 'Valor',
                                        },
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <h1 className="text-center">No se han cargado datos. Debes subir un archivo CSV.</h1>
                            <div className="font-sans text-center">
                                <Link to="/uploadfile" ><ColorButton >Haz clic aquí para subir el archivo CSV.</ColorButton></Link>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default DashboardByCategoryPage
