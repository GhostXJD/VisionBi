import { useMemo, useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useAuth } from "../../context/AuthContext";
import { getCsvDatoRequest } from "../../api/csvDatos";
import Papa from "papaparse";
import { useNavigate } from "react-router";

function OrdersByMonth() {
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
                        date: row.date, // Mantenemos el campo de fecha sin cambios
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

    // Preparar los datos para ApexCharts
    const chartData = {
        options: {
            chart: {
                type: "pie",
                height: 600,
            },
            colors: ['#8F3C8A', '#4535AA', '#D6D1F5', '#ED639E', '#9b59b6', '#E8789A', '#FCBD8D', '#EDDAB9', '#98B6EC', '#E79796','#9F8189','#FFCAD4'],
            labels: Object.keys(ordersByTimeUnit),
            title: {
                text: "Total de pedidos por mes",
            },
            
        },
        series: Object.values(ordersByTimeUnit),
    };

    return (
        <div>
            <div className="select-container">
                <select
                    color="secondary"
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
            <h1 className="text-center">Pedidos por mes</h1>
            <ApexCharts options={chartData.options} series={chartData.series} type="pie" height={600} />
        </div>
    );
}

export default OrdersByMonth;
