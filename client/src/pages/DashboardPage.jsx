import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { getCsvDatoRequest } from '../api/csvDatos';
import Papa from 'papaparse';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const [csvData, setCsvData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false); // Estado para verificar si los datos están disponibles

  useEffect(() => {
    if (!isAuthenticated) navigate('/inicio');
  }, [isAuthenticated]);

  useEffect(() => {
    getCsv();
  }, []);

  const getCsv = async () => {
    console.log("Obteniendo datos del archivo CSV...");
    try {
      const response = await getCsvDatoRequest(usuario.company);
      console.log("Respuesta de la API:", response);
      Papa.parse(response.data, {
        complete: (parsedData) => {
          const data = parsedData.data;
          setCsvData(data);
          setDataAvailable(true); // Marcamos que los datos están disponibles
        },
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      console.log("Error al obtener los datos:", error);
      setDataAvailable(false); // Marcamos que los datos no están disponibles
    }
  };

  const transformDataForChart = () => {
    const chartData = [["Fecha", "Valor Total"]];

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.Fecha);
      const valorTotal = rowData.Cantidad * rowData.Precio;
      chartData.push([fecha, valorTotal]);
    }

    return chartData;
  };

  return (
    <div>
      {dataAvailable ? (
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={transformDataForChart()}
          options={{
            hAxis: {
              title: "Fecha",
            },
            vAxis: {
              title: "Valor Total",
            },
            series: {
              1: { curveType: "function" },
            },
          }}
        />
      ) : (
        <p>Se requieren datos</p>
      )}
    </div>
  );
}
