import { useEffect, useState } from "react";
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
    const chartData = [["Month", "Total value"]];
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
    const chartData = [["Date", "Total value"]];

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const valorTotal = rowData.quantity * rowData.price;
      chartData.push([fecha, valorTotal]);
    }

    return chartData;
  };

  const transformDataForSalesByState = () => {
    const chartData = [["State", "Sales Quantity"]];
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
            chartType="LineChart"
            width="100%"
            height="400px"
            data={transformDataForChart()}
            options={{
              hAxis: {
                title: "Date",
              },
              vAxis: {
                title: "Total Value",
              },
              series: {
                1: { curveType: "function" },
              },
            }}
          />
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={transformDataForSalesByMonth()}
            options={{
              title: "Sales per Month",
              hAxis: { title: "Month" },
              vAxis: { title: "Total Value" },
            }}
          />
          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={transformDataForSalesByState()}
            options={{
              title: "Sales Quantity by State",
              hAxis: { title: "State" },
              vAxis: { title: "Sales Quantity" },
            }}
          />
        </div>
      ) : (
        <p>Data is required</p>
      )}
    </div>
  );
}
