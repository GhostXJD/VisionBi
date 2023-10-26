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
            navigate("/inicio");
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
                        date: row.date, // No se formatea la fecha
                        price: parseFloat(row.price), // Convierte a número
                        quantity: parseInt(row.quantity), // Convierte a número
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
            const fecha = new Date(rowData.date);
            return fecha.getFullYear().toString() === selectedYear;
        });
    };

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
            colors: ["#8F3C8A"],

        },
        series: [
            {
                name: "Sales Quantity",
                data: Object.values(salesByDate),
            },
        ],
    };
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return (
        <div>
            <div className="select-container">
                <select
                    className="select-element"
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    <option value="">Select a Year</option>
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
            <div className="select-container">
                <select
                    className="select-element"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                >
                    <option value="">Select a Month</option>
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
            <h1 className="text-center">Sales Trend Over Time</h1>
            <ApexCharts options={chartData.options} series={chartData.series} type="line" height={400} />
        </div>
    );
}

export default SalesTrendOverTime;
