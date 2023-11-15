import React from 'react'
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { getCsvDatoRequest, getPredictBycategoryRequest } from "../api/csvDatos";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

function DashboardByCategoryPage() {
    
    const [csvData, setCsvData] = useState([]);
    const [predictData, setPredictData] = useState([]);
    const [dataAvailable, setDataAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCsv();
    }, []);

    useEffect(() => {
        getPredictByCategory();
    }, []);

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
            const res = await getPredictBycategoryRequest(usuario.company);
            console.log('Predict: ', res.data)
            setPredictData(res.data);
            setLoading(true)
        } catch (error) {
            console.log("Error al predecir", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div>
            holi
        </div>
    )
}

export default DashboardByCategoryPage
