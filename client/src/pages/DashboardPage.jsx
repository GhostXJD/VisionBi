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
  const Chartes = () => {
    const chartData = [["Date", "Total value"]];

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const valorTotal = rowData.quantity * rowData.price;
      chartData.push([fecha, valorTotal]);
    }

    return chartData;
  };

  const RevenueByCategory = () => {
    const chartData = [["Categpry", "Revenue"]];
    const categorySales = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const category = rowData.category;
      const valorTotal = rowData.quantity * rowData.price;

      if (categorySales[category]) {
        categorySales[category] += valorTotal;
      } else {
        categorySales[category] = valorTotal;
      }
    }


    for (const category in categorySales) {
      chartData.push([category, categorySales[category]]);
    }

    return chartData;
  };

  const SalesByNeighborhood = () => {
    const chartData = [["Neighborhood", "Sales Quantity"]];
    const neighborhoodSales = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const neighborhood = rowData.neighborhood;

      if (neighborhoodSales[neighborhood]) {
        neighborhoodSales[neighborhood]++;
      } else {
        neighborhoodSales[neighborhood] = 1;
      }
    }

    // Ordena los vecindarios por cantidad de ventas en orden descendente
    const sortedNeighborhoods = Object.keys(neighborhoodSales).sort(
      (a, b) => neighborhoodSales[b] - neighborhoodSales[a]
    );

    // Toma solo los 10 primeros vecindarios
    const top10Neighborhoods = sortedNeighborhoods.slice(0, 10);

    for (const neighborhood of top10Neighborhoods) {
      chartData.push([neighborhood, neighborhoodSales[neighborhood]]);
    }

    return chartData;
  };

  const SalesTrend = () => {
    const chartData = [["Date", "Sales Quantity"]];
    const salesByDate = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date).toLocaleDateString(); // Ajusta el formato de fecha según tus datos
      const valorTotal = rowData.quantity * rowData.price;

      if (salesByDate[fecha]) {
        salesByDate[fecha] += valorTotal;
      } else {
        salesByDate[fecha] = valorTotal;
      }
    }

    for (const date in salesByDate) {
      chartData.push([date, salesByDate[date]]);
    }

    return chartData;
  };

  const SalesByMonth = () => {
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

  const SalesByState = () => {
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
            data={Chartes()}
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
          <h1>REVENUES BY CATEGORY</h1>
          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={RevenueByCategory()}
            options={{
              title: "",
              hAxis: { title: "Revenue" },
              vAxis: { title: "Category" },
            }}
          />
          <h1>NEIGHBORHOOD SALES</h1>

          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={SalesByNeighborhood()}
            options={{
              title: "",
              hAxis: { title: "Sales Quantity" },
              vAxis: { title: "Neighborhood" },
            }}
          />
          <h1>Sales Trend Over Time</h1>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={SalesTrend()}
            options={{
              title: "",
              hAxis: { title: "Fecha" },
              vAxis: { title: "Cantidad de Ventas" },
            }}
          />

          <h1>monthly sales</h1>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={SalesByMonth()}
            options={{
              title: "",
              hAxis: { title: "Month" },
              vAxis: { title: "Total Value" },
            }}
          />
          <h1 className="font-normal">Sales Quantity by State</h1>
          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={SalesByState()}
            options={{
              title: "",
              hAxis: { title: "Sales Quantity" },
              vAxis: { title: "State" },
            }}
          />
        </div>
      ) : (
        <h1 className="text-center">Data is required</h1>
      )}
    </div>
  );
}
