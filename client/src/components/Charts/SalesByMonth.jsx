import { useMemo, useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useAuth } from "../../context/AuthContext";
import { getCsvDatoRequest } from "../../api/csvDatos";
import Papa from "papaparse";
import { useNavigate } from "react-router";

function SalesByMonth() {
    const navigate = useNavigate();
    const { isAuthenticated, usuario, setAuthenticated } = useAuth();
    const [csvData, setCsvData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

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

    async function getCsv() {
        try {
            const response = await getCsvDatoRequest(usuario.company);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: row.date, // No se formatea la fecha
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
            const fecha = new Date(rowData.date);
            return fecha.getFullYear().toString() === selectedYear;
        });
    }
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const monthlySales = {};

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    for (let i = 0; i < csvDataFiltered.length; i++) {
        const rowData = csvDataFiltered[i];
        const fecha = new Date(rowData.date);
        const month = fecha.getMonth();
        const valorTotal = rowData.skuValue;

        if (monthlySales[month]) {
            monthlySales[month] += valorTotal;
        } else {
            monthlySales[month] = valorTotal;
        }
    }
    const formatNumber = (value) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + "M";
        } else if (value >= 1000) {
            return (value / 1000).toFixed(2) + "K";
        } else {
            return value.toFixed(2);
        }
    };
    
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
                    text: "Mes",
                },
            },
            yaxis: {
                title: {
                    text: "Valor total",
                },
                labels: {
                    formatter: (value) => formatNumber(value), // Usa la función de formato
                },
            },
            colors: ["#8F3C8A"],
        },
        series: [
            {
                name: "Valor total",
                data: monthNames.map((month, index) => monthlySales[index] || 0),
            },
        ],
    };
    

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
            <h1 className="text-center">Ventas mensuales</h1>
            <ApexCharts options={chartData.options} series={chartData.series} type="bar" height={600} />
        </div>
    );
}

export default SalesByMonth;
