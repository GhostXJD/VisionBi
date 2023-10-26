import { useEffect, useState, useMemo } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { getCsvDatoRequest, getPredictRequest } from "../api/csvDatos";
import Papa from "papaparse";
import moment from 'moment';
import ApexCharts from "react-apexcharts";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const [csvData, setCsvData] = useState([]);
  const [predictData, setPredictData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

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
    // Simulación de tiempo de carga
    setTimeout(() => {
      const totalOrders = csvData.length;

      // Dar formato al número total de órdenes con puntos como separadores de miles
      const formattedTotalOrders = totalOrders.toLocaleString();

      const totalSales = csvData.reduce((total, row) => {
        return total + row.quantity * row.price;
      }, 0);

      // Dar formato al monto total con puntos como separadores de miles
      const formattedTotalSales = totalSales.toLocaleString();

      setTotalOrders(formattedTotalOrders);
      setTotalSales(formattedTotalSales);
    }, 1000); // Simulación de tiempo de carga
  }, [csvData]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  useEffect(() => {
    getCsv(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    getPredict();
  }, []);

  const getCsv = async () => {
    try {
      const response = await getCsvDatoRequest(usuario.company);
      console.log("Respuesta de la API:", response);
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
    } catch (error) {
      console.log("Error al obtener los datos:", error);
      setDataAvailable(false);
    }
  };

  const getPredict = async () => {
    try {
      const res = await getPredictRequest(usuario.company);
      console.log('Predict: ', res.data)
      setPredictData(res.data);
    } catch (error) {
      console.log("Error al predecir", error);
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
    const chartData = [["Date", "Total Value", "Predicted Value"]];

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const fecha = new Date(rowData.date);
      const valorTotal = rowData.quantity * rowData.price;

      // Encuentra la predicción correspondiente para esta fecha
      const predictedValues = predictData.predictions[0]; // asumiendo que solo hay una predicción
      const predictedValue = predictedValues[i]; // predicción para el mismo período de tiempo que los datos originales

      chartData.push([fecha, valorTotal, predictedValue]);
    }

    return (
      <div>
        <h1 className="text-center">Original</h1>
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
              title: "Value",
            },
            series: {
              0: { curveType: "function" },
              1: { curveType: "function" }, // Esto permite curvas en ambas series (datos originales y predicciones)
            },
          }}
        />
      </div>
    );
  };

  const RevenueByCategory = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
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

    // Prepare data for ApexCharts
    const chartData = {
      options: {
        chart: {
          type: "area",
          height: 400,
        },
        xaxis: {
          categories: top10Categories,
          title: {
            text: "Category",
          },
        },
        yaxis: {
          title: {
            text: "Sales Quantity",
          },
        },
      },
      series: [
        {
          name: "Sales Quantity",
          data: top10Categories.map((category) => categorySales[category]),
        },
      ],
    };

    return (
      <div>
        <h1 className="text-center">TOP 10 REVENUES BY CATEGORY</h1>
        <ApexCharts options={chartData.options} series={chartData.series} type="area" height={400} />
      </div>
    );
  };
  const SalesByNeighborhood = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
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

    // Prepare data for ApexCharts
    const chartData = {
      options: {
        chart: {
          type: "line",
          height: 400,
        },
        xaxis: {
          categories: top10Neighborhoods,
          title: {
            text: "Neighborhood",
          },
        },
        yaxis: {
          title: {
            text: "Sales Quantity",
          },
        },
      },
      series: [
        {
          name: "Sales Quantity",
          data: top10Neighborhoods.map((neighborhood) => neighborhoodSales[neighborhood]),
        },
      ],
    };

    return (
      <div>
        <h1 className="text-center">TOP 10 NEIGHBORHOOD SALES</h1>
        <ApexCharts options={chartData.options} series={chartData.series} type="line" height={400} />
      </div>
    );
  };

  const SalesTrendOverTime = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
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

    const chartData = {
      options: {
        chart: {
          type: "line",
          height: 400,
        },
        xaxis: {
          categories: Object.keys(salesByDate),
          title: {
            text: "Date",
          },
        },
        yaxis: {
          title: {
            text: "Sales Quantity",
          },
        },
      },
      series: [
        {
          name: "Sales Quantity",
          data: Object.values(salesByDate),
        },
      ],
    };

    return (
      <div>
        <h1 className="text-center">Sales Trend Over Time</h1>
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
        <ApexCharts options={chartData.options} series={chartData.series} type="line" height={400} />
      </div>
    );
  };
  const SalesByMonth = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
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

    // Prepare data for ApexCharts
    const chartData = {
      options: {
        chart: {
          type: "bar",
          height: 600,
        },
        xaxis: {
          categories: monthNames,
          title: {
            text: "Month",
          },
        },
        yaxis: {
          title: {
            text: "Total Value",
          },
        },
      },
      series: [
        {
          name: "Total Value",
          data: monthNames.map((month, index) => monthlySales[index] || 0),
        },
      ],
    };

    return (
      <div>
        <h1 className="text-center">Monthly Sales</h1>
        <ApexCharts options={chartData.options} series={chartData.series} type="bar" height={600} />
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
        <h1 className="font-normal text-center">Sales Quantity by State</h1>
        <Chart
          chartType="Scatter"
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
  const OrdersByTimeUnit = () => {
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const ordersByTimeUnit = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
      const rowData = csvDataFiltered[i];
      const fecha = new Date(rowData.date);
      const month = fecha.toLocaleDateString('default', { month: 'long' });

      if (ordersByTimeUnit[month]) {
        ordersByTimeUnit[month]++;
      } else {
        ordersByTimeUnit[month] = 1;
      }
    }

    // Prepare data for ApexCharts
    const chartData = {
      options: {
        chart: {
          type: "RadarChart",
          height: 600,
        },
        labels: Object.keys(ordersByTimeUnit),
        title: {
          text: "Orders by Month",
        },
      },
      series: Object.values(ordersByTimeUnit),
    };

    return (
      <div>
        <h1 className="text-center">Orders by Month</h1>
        <ApexCharts options={chartData.options} series={chartData.series} type="pie" height={600} />
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
    } else if (selectedChart === "OrdersByTimeUnit") {
      return <OrdersByTimeUnit />;
    }
  };

  return (

    <div className="mt-14">

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
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">${totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Orders sold</p>
              <p className="text-2xl">{totalOrders}</p>
            </div>
          </div>
        </div>
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
              <option value="OrdersByTimeUnit">Orders by Month</option>
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
