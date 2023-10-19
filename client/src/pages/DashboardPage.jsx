import { useEffect, useState, useMemo } from "react";
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
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Para seleccionar año y filtrar evitando colapso
  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  };

  // Para cambiar graficos
  const handleChartChange = (event) => {
    const chartName = event.target.value;
    setSelectedChart(chartName);
  };

  // Para cambiar mes de un grafico
  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/inicio");
  }, [isAuthenticated]);

  useEffect(() => {
    getCsv(selectedYear);
  }, [selectedYear]);

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

  // Define una función de utilidad para filtrar y manipular datos por año
  const filterAndProcessDataByYear = (data, selectedYear) => {
    if (!selectedYear) return [];
    return data.filter((rowData) => {
      const fecha = new Date(rowData.date);
      return fecha.getFullYear().toString() === selectedYear;
    });
  };

  const Original = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const chartData = [["Date", "Total value"]];

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const fecha = new Date(rowData.date);
      const valorTotal = rowData.quantity * rowData.price;
      chartData.push([fecha, valorTotal]);
    }

    return (
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
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
    );
  };

  const RevenueByCategory = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const chartData = [["Category", "Sales Quantity"]];
    const categorySales = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const category = rowData.category;

      if (categorySales[category]) {
        categorySales[category]++;
      } else {
        categorySales[category] = 1;
      }
    }

    const sortedCategories = Object.keys(categorySales).sort(
      (a, b) => categorySales[b] - categorySales[a]
    );

    const top10Categories = sortedCategories.slice(0, 10);

    for (const category of top10Categories) {
      chartData.push([category, categorySales[category]]);
    }

    return (
      <div>
        <h1>TOP 10 REVENUES BY CATEGORY</h1>
        <Chart
          chartType="BarChart"
          width="100%"
          height="800px"
          data={chartData}
          options={{
            title: "",
            hAxis: { title: "Revenue" },
            vAxis: { title: "Category" },
          }}
        />
      </div>
    );
  };

  const SalesByNeighborhood = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const chartData = [["Neighborhood", "Sales Quantity"]];
    const neighborhoodSales = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const neighborhood = rowData.neighborhood;

      if (neighborhoodSales[neighborhood]) {
        neighborhoodSales[neighborhood]++;
      } else {
        neighborhoodSales[neighborhood] = 1;
      }
    }

    const sortedNeighborhoods = Object.keys(neighborhoodSales).sort(
      (a, b) => neighborhoodSales[b] - neighborhoodSales[a]
    );

    const top10Neighborhoods = sortedNeighborhoods.slice(0, 10);

    for (const neighborhood of top10Neighborhoods) {
      chartData.push([neighborhood, neighborhoodSales[neighborhood]]);
    }

    return (
      <div>
        <h1>TOP 10 NEIGHBORHOOD SALES</h1>
        <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: "",
            hAxis: { title: "Sales Quantity" },
            vAxis: { title: "Neighborhood" },
          }}
        />
      </div>
    );
  };

  const SalesTrendOverTime = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const chartData = [["Date", "Sales Quantity"]];
    const salesByDate = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const fecha = new Date(rowData.date);
      const month = fecha.getMonth() + 1;
      const valorTotal = rowData.quantity * rowData.price;

      if (selectedMonth === "" || month.toString() === selectedMonth) {
        if (salesByDate[fecha.toLocaleDateString()]) {
          salesByDate[fecha.toLocaleDateString()] += valorTotal;
        } else {
          salesByDate[fecha.toLocaleDateString()] = valorTotal;
        }
      }
    }

    for (const date in salesByDate) {
      chartData.push([date, salesByDate[date]]);
    }

    return (
      <div>
        <h1>Sales Trend Over Time</h1>
        <select
          className="select-element"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="">Select a Month</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: "",
            hAxis: { title: "Date" },
            vAxis: { title: "Sales Quantity" },
          }}
        />
      </div>
    );
  };

  const SalesByMonth = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const chartData = [["Month", "Total Value"]];
    const monthlySales = {};

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const fecha = new Date(rowData.date);
      const month = fecha.getMonth();
      const valorTotal = rowData.quantity * rowData.price;

      if (monthlySales[month]) {
        monthlySales[month] += valorTotal;
      } else {
        monthlySales[month] = valorTotal;
      }
    }

    for (const month in monthlySales) {
      chartData.push([monthNames[parseInt(month)], monthlySales[month]]);
    }

    return (
      <div>
        <h1>Monthly Sales</h1>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: "",
            hAxis: { title: "Month" },
            vAxis: { title: "Total Value" },
          }}
        />
      </div>
    );
  };

  const SalesByState = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const chartData = [["State", "Sales Quantity"]];
    const stateSales = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
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

    return (
      <div>
        <h1 className="font-normal">Sales Quantity by State</h1>
        <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: "",
            hAxis: { title: "Sales Quantity" },
            vAxis: { title: "State" },
          }}
        />
      </div>
    );
  };

  const renderSelectedChart = () => {
    if (!selectedYear) {
      return <h1 className="text-center">Please select a year first</h1>;
    }
    if (selectedChart === "Original") {
      return <Original />;
    } else if (selectedChart === "RevenueByCategory") {
      return <RevenueByCategory />;
    } else if (selectedChart === "SalesByNeighborhood") {
      return <SalesByNeighborhood />;
    } else if (selectedChart === "SalesTrendOverTime") {
      return <SalesTrendOverTime />;
    } else if (selectedChart === "SalesByMonth") {
      return <SalesByMonth />;
    } else if (selectedChart === "SalesByState") {
      return <SalesByState />;
    }
  };

  return (
    <div>
      <div className="select-container">
        <select
          className="select-element"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Select a Time</option>
          {csvData
            .map((rowData) => new Date(rowData.date).getFullYear())
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((year) => (
              <option
                key={year}
                value={year}
                className={selectedYear === year ? "selected" : ""}
              >
                {year}
              </option>
            ))}
        </select>
      </div>
      {dataAvailable ? (
        <div>
          <div className="select-container">
            <select
              className="select-element"
              value={selectedChart}
              onChange={handleChartChange}
            >
              <option value="">Select a Chart</option>
              <option value="Original">Original Chart</option>
              <option value="RevenueByCategory">Revenue by Category Chart</option>
              <option value="SalesByNeighborhood">Sales by Neighborhood Chart</option>
              <option value="SalesTrendOverTime">Sales Trend Over Time</option>
              <option value="SalesByMonth">Monthly Sales</option>
              <option value="SalesByState">Sales Quantity by State</option>
            </select>
          </div>
          {selectedChart && renderSelectedChart()}
        </div>
      ) : (
        <h1 className="text-center">Data is required</h1>
      )}
    </div>
  );
}
