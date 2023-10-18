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
  const [selectedYear, setSelectedYear] = useState(""); // Estado para el año seleccionado

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  };
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

          // Filtra los datos por el año seleccionado
          const filteredData = selectedYear
            ? data.filter((rowData) => {
              const fecha = new Date(rowData.date);
              return fecha.getFullYear().toString() === selectedYear;
            })
            : data;

          setCsvData(filteredData);
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

  const filterDataByYear = () => {
    if (!selectedYear) return csvData;
    return csvData.filter((rowData) => {
      const fecha = new Date(rowData.date);
      return fecha.getFullYear().toString() === selectedYear;
    });
  };

  const Original = () => {
    const csvData = filterDataByYear(); // Filtra por año seleccionado

    const chartData = [["Date", "Total value"]];

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const valorTotal = rowData.quantity * rowData.price;
      chartData.push([fecha, valorTotal]);
    }

    return chartData;
  };

  // Función para obtener el top 10 de categorías con la mayor cantidad de ventas
  const RevenueByCategory = () => {
    const csvData = filterDataByYear(); // Filtra por año seleccionado

    const chartData = [["Category", "Sales Quantity"]];
    const categorySales = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const category = rowData.category;

      if (categorySales[category]) {
        categorySales[category]++;
      } else {
        categorySales[category] = 1;
      }
    }

    // Ordena las categorías por cantidad de ventas en orden descendente
    const sortedCategories = Object.keys(categorySales).sort(
      (a, b) => categorySales[b] - categorySales[a]
    );

    // Toma solo las 10 primeras categorías
    const top10Categories = sortedCategories.slice(0, 10);

    for (const category of top10Categories) {
      chartData.push([category, categorySales[category]]);
    }

    return chartData;
  };

  const SalesByNeighborhood = () => {
    const csvData = filterDataByYear(); // Filtra por año seleccionado

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

  const SalesTrendOverTime = (selectedMonth) => {
    const csvData = filterDataByYear(); // Filtra por año seleccionado

    const chartData = [["Date", "Sales Quantity"]];
    const salesByDate = {};

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const month = fecha.getMonth() + 1;
      const valorTotal = rowData.quantity * rowData.price;

      if (selectedMonth === "" || month.toString() === selectedMonth) { // Filtrar por mes seleccionado
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

    return chartData;
  };

  const SalesByMonth = () => {
    const csvData = filterDataByYear(); // Filtra por año seleccionado

    const chartData = [["Month", "Total value"]];
    const monthlySales = {};

    // Array de nombres de meses
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 0; i < csvData.length; i++) {
      const rowData = csvData[i];
      const fecha = new Date(rowData.date);
      const month = fecha.getMonth(); // Obtén el número del mes (0-11)
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

    return chartData;
  };


  const SalesByState = () => {
    const csvData = filterDataByYear(); // Filtra por año seleccionado

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
  const [selectedMonth, setSelectedMonth] = useState(""); // Estado para el mes seleccionado

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };



  return (
    <div>
      <div>
        <select
          className="dark:text-black"
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}
        >
          <option value="">Select a Time</option>
          {/* Agrega opciones para cada año presente en tus datos CSV */}
          {csvData
            .map((rowData) => new Date(rowData.date).getFullYear())
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>
      {dataAvailable ? (

        selectedYear ? (
          <div>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={Original()}
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
            <h1>TOP 10 REVENUES BY CATEGORY</h1>
            <Chart
              chartType="BarChart"
              width="100%"
              height="800px"
              data={RevenueByCategory()}
              options={{
                title: "",
                hAxis: { title: "Revenue" },
                vAxis: { title: "Category" },
              }}
            />
            <h1>TOP 10 NEIGHBORHOOD SALES</h1>

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
            <select className="dark:text-black" value={selectedMonth} onChange={handleMonthChange}>
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
              {/* Agrega más meses según tus necesidades */}
            </select>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={SalesTrendOverTime(selectedMonth)} // Pasa el mes seleccionado a la función
              options={{
                title: "",
                hAxis: { title: "Date" },
                vAxis: { title: "Sales Quantity" },
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
          <h1 className="text-center">Please select a time</h1>
        )
      ) : (
        <h1 className="text-center">Data is required</h1>
      )}
    </div>
  );
}  