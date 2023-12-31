import { useMemo, useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useAuth } from "../../context/AuthContext";
import { getCsvDatoRequest } from "../../api/csvDatos";
import Papa from "papaparse";
import { useNavigate } from "react-router";

function SalesTrendOverTime() {
    const navigate = useNavigate();
    const { isAuthenticated, usuario, setAuthenticated } = useAuth();
    const [csvData, setCsvData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        const isAuthenticatedFromLocalStorage = localStorage.getItem("isAuthenticated");
        if (isAuthenticatedFromLocalStorage === "true") {
            setAuthenticated(true);
        }
    }, [setAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        getCsv();
    }, []);

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
    };

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
    };

    async function getCsv() {
        try {
            const response = await getCsvDatoRequest(usuario.company);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: new Date(row.date), // Formatea la fecha como objeto Date
                        skuValue: parseInt(row.skuValue), // Convierte a número
                    }));
                    setCsvData(data);
                },
                header: true,
                skipEmptyLines: true,
            });
        } catch (error) {
            console.log("Error al obtener los datos:", error);
        }
    }

    const filterAndProcessDataByYear = (data, selectedYear) => {
        if (!selectedYear) return [];
        return data.filter((rowData) => {
            const fecha = rowData.date;
            return fecha.getFullYear().toString() === selectedYear;
        });
    };

    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const salesByDate = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
        const rowData = csvDataFiltered[i];
        const fecha = rowData.date;
        const month = fecha.getMonth() + 1;
        const day = fecha.getDate();
        const valorTotal = rowData.skuValue;

        if (selectedMonth === "" || month.toString() === selectedMonth) {
            const formattedDate = `${fecha.getFullYear()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            if (salesByDate[formattedDate]) {
                salesByDate[formattedDate] += valorTotal;
            } else {
                salesByDate[formattedDate] = valorTotal;
            }
        }
    }

    // Ordena las fechas en orden ascendente
    const sortedDates = Object.keys(salesByDate).sort();

    const chartData = {
        options: {
            chart: {
                type: "line",
                height: 400,
            },
            xaxis: {
                categories: sortedDates,
                title: {
                    text: "Fecha",
                },
            },
            yaxis: {
                title: {
                    text: "Monto vendido",
                },
                labels: {
                    formatter: function (value) {
                        // Formatea el valor como entero sin decimales con punto como separador de miles
                        return new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true,
                        }).format(value);
                    },
                },
            },
            colors: ["#8F3C8A"],
        },
        series: [
            {
                name: "Monto vendido",
                data: sortedDates.map((date) => salesByDate[date]),
            },
        ],
    };
    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    return (
        <div>
            <div className="select-container">
                <select
                    className="select-element"
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    <option value="">Seleccionar año</option>
                    {csvData
                        .map((rowData) => rowData.date.getFullYear())
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
            <div className="select-container">
                <select
                    className="select-element"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                >
                    <option value="">Seleccionar mes</option>
                    {monthNames.map((monthName, index) => (
                        <option
                            key={index}
                            value={(index + 1).toString()}
                            className={selectedMonth === (index + 1).toString() ? "selected" : ""}
                        >
                            {monthName}
                        </option>
                    ))}
                </select>
            </div>
            <h1 className="text-center">Tendencia de ventas a lo largo del tiempo</h1>
            <ApexCharts options={chartData.options} series={chartData.series} type="line" height={400} />
        </div>
    );
}

export default SalesTrendOverTime;
