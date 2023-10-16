import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { getCsvDatoRequest } from "../api/csvDatos";
import Papa from "papaparse";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const [csvData, setCsvData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/inicio");
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
          setDataAvailable(true);
        },
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      console.log("Error al obtener los datos:", error);
      setDataAvailable(false);
    }
  };

  const transformDataForSalesByMonth = () => {
    const chartData = [["Mes", "Valor Total"]];
    const monthlySales = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const month = fecha.getMonth() + 1;
      const valorTotal = rowData.quantity * rowData.price;

      if (monthlySales[month]) {
        monthlySales[month] += valorTotal;
      } else {
        monthlySales[month] = valorTotal;
      }
    }

    for (const month in monthlySales) {
      chartData.push([month.toString(), monthlySales[month]]);
    }

    return chartData;
  };

  const transformDataForChart = () => {
    const chartData = [["Fecha", "Valor Total"]];

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const valorTotal = rowData.quantity * rowData.price;
      chartData.push([fecha, valorTotal]);
    }

    return chartData;
  };

  const transformDataForSalesByState = () => {
    const chartData = [["Estado", "Cantidad de Ventas"]];
    const stateSales = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const state = rowData.state;

      if (stateSales[state]) {
        stateSales[state]++;
      } else {
        stateSales[state] = 1;
      }
    }

    for (const state in stateSales) {
      chartData.push([state, stateSales[state]]);
    }

    return chartData;
  };

  return (
    <div>
      {dataAvailable ? (
        <div>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={transformDataForSalesByMonth()}
            options={{
              title: "Ventas por Mes",
              hAxis: { title: "Mes" },
              vAxis: { title: "Valor Total" },
            }}
          />
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
    

          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={transformDataForSalesByState()}
            options={{
              title: "Cantidad de Ventas por Estado",
              hAxis: { title: "Estado" },
              vAxis: { title: "Cantidad de Ventas" },
            }}
          />
        </div>
      ) : (
        <p>Se requieren datos</p>
      )}
    </div>
  );
}
